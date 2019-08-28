IF OBJECT_ID(N'dbo.DBScripts', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[DBScripts]
	(
	  [DBScriptID] INT NOT NULL PRIMARY KEY IDENTITY,
	  [ScriptName] NVARCHAR(200) NOT NULL,
	  [ScriptType] NVARCHAR(200) NOT NULL,
	  [ExecutedAt] datetime not null,
	  [Duration] float not null,
	  [Successful] bit not null,
	  [ErrorMessage] NVARCHAR(MAX) NULL,
	  [ScriptContent] NVARCHAR(MAX) NULL
	)
end