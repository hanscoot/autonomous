#addin "Cake.Npm"

var target = Argument("target", "Zip");

Task("Copy")
	.IsDependentOn("ClientAppBuild")
	.Does(() =>
{
	CreateDirectory("./Output/wwwroot");
	CreateDirectory("./Output/SQL");
	CreateDirectory("./Output/logs");
	CopyDirectory("../AutonomousBuilding/wwwroot","./Output/wwwroot"); 
	CopyDirectory("../AutonomousBuilding/SQL","./Output/SQL"); 
	CleanDirectories("./Output/ClientApp");
	DeleteDirectory("./Output/ClientApp");
});

Task("Zip")
	.IsDependentOn("Copy")
	.Does(() =>
{
	Zip("./Output/", "./Output/Artifacts.zip");
});

Task("NpmCi")
  .IsDependentOn("DotNetBuild")
  .Does(() => 
{
	var settings = new NpmCiSettings();
	settings.WorkingDirectory = "..//AutonomousBuilding/ClientApp";
	NpmCi(settings);
});

Task("ClientAppBuild")
  .IsDependentOn("NpmCi")
  .Does(() => 
{	
    var runSettings = new NpmRunScriptSettings {
      ScriptName = "build-prod",
      WorkingDirectory = "..//AutonomousBuilding/ClientApp",
    };
    //runSettings.Arguments.Add("build");
    //runSettings.Arguments.Add("--prod");
	
	NpmRunScript(runSettings);
});

Task("DotNetBuild")
.IsDependentOn("Clean")
  .Does(() =>	
{
    var settings = new DotNetCorePublishSettings
     {
         //Framework = "netcoreapp2.0",
         Configuration = "Release",
         OutputDirectory = "./Output/",
		 Runtime = "win7-x64"
     };

     DotNetCorePublish("..//AutonomousBuilding.sln", settings);
  
  
});

Task("Clean")
	.Does(() =>
	{
		CleanDirectories("./Output");
	});

RunTarget(target);
