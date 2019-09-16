using AutonomousBuilding.Models;
using Dapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AutonomousBuilding.service
{
  public interface IDatabaseService
  {
    void RunMigrationScripts();
  }

  public class DatabaseService : IDatabaseService
  {
    private readonly string connString;
    private readonly string basePath;
    public DatabaseService(IConfiguration config, IHostingEnvironment hostingEnvironment)
    {
      this.connString = config.GetConnectionString("default");
      this.basePath = hostingEnvironment.ContentRootPath;
    }

    public void RunMigrationScripts()
    {
      var scripts = GetScriptFiles();
      var results = new List<ScriptResponse>();

      // Do repeats
      foreach (var s in scripts.Where(ss => ss.Type.Equals("Repeat", StringComparison.OrdinalIgnoreCase)).OrderBy(ss => ss.Seq))
      {
        var r = RunScript(s);
        results.Add(r);
        if (!r.Successful) break;
      }

      // Do onces
      if (!results.Any(r => !r.Successful))
      {
        foreach (var s in scripts.Where(ss => ss.Type.Equals("Once", StringComparison.OrdinalIgnoreCase)).OrderBy(ss => ss.Seq))
        {
          if (!HasScriptRun(s))
          {
            var r = RunScript(s);
            results.Add(r);
            if (!r.Successful) break;
          }
        }
      }

      LogScriptResults(results);
    }

    private void LogScriptResults(List<ScriptResponse> responses)
    {
      using (var conn = new SqlConnection(connString))
      {
        conn.Open();
        foreach (var resp in responses)
        {
          conn.Execute("INSERT INTO [dbo].[DBScripts] ([ScriptName], [ScriptType], [ExecutedAt], [Duration], [Successful], [ErrorMessage], [ScriptContent]) VALUES (@ScriptName, @ScriptType, @ExecutedAt, @Duration, @Successful, @ErrorMessage, @ScriptContent)", new { ScriptName = resp.ScriptFile.FileName, ScriptType = resp.ScriptFile.Type, resp.ExecutedAt, resp.Duration, resp.Successful, resp.ErrorMessage, ScriptContent = resp.Sql });
        }
      }
    }

    private bool HasScriptRun(ScriptFile Script)
    {
      var result = false;
      try
      {
        using (var conn = new SqlConnection(this.connString))
        {
          conn.Open();
          result = conn.Query("select * from [dbo].[DBScripts] where [ScriptName] = @ScriptName and Successful = 1", new { ScriptName = Script.FileName }).Any();
        }
      }
      catch (Exception)
      {
        result = false;
      }
      return result;
    }

    private ScriptResponse RunScript(ScriptFile Script)
    {
      var resp = new ScriptResponse
      {
        ScriptFile = Script,
        Successful = true,
        Sql = File.ReadAllText(Script.FilePath)
      };
      var sw = new Stopwatch();
      sw.Start();
      try
      {
        using (var conn = new SqlConnection(this.connString))
        {
          conn.Open();
          resp.ExecutedAt = DateTime.UtcNow;
          conn.Execute(resp.Sql);
          sw.Stop();
        }
      }
      catch (Exception er)
      {
        sw.Stop();
        resp.Successful = false;
        resp.ErrorMessage = er.Message;
      }
      resp.Duration = sw.Elapsed.TotalSeconds;
      return resp;
    }

    private List<ScriptFile> GetScriptFiles()
    {
      var files = new List<ScriptFile>();
      foreach (var s in new DirectoryInfo(Path.Combine(this.basePath, "SQL")).GetFiles("*.sql"))
      {
        var sf = new ScriptFile();
        sf.FileName = Path.GetFileNameWithoutExtension(s.Name);
        var nameSplit = sf.FileName.Split('_').Select(ss => ss.Replace('-', '_')).ToList();
        sf.Type = nameSplit[0];
        sf.Seq = Convert.ToInt32(nameSplit[1]);
        sf.FilePath = s.FullName;
        files.Add(sf);
      }
      return files;
    }
  }

}
