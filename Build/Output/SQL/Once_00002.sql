IF OBJECT_ID(N'dbo.TestData', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[TestData]
	(
	  [TestDataID] INT NOT NULL PRIMARY KEY IDENTITY,
	  [Name] NVARCHAR(200) NOT NULL
	)

  INSERT INTO [dbo].[TestData] ([Name]) Values ('Phil'), ('Anthony'), ('James'), ('Tom'), ('Oliver'), ('Steve 1'), ('Steve 2'), ('Steve 3')
end