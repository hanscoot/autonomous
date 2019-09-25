IF OBJECT_ID(N'dbo.People', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[People](
	[PersonId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Email] [varchar](50) NULL,
	[Number] [int] NULL,
	[Password] [varchar](50) NULL,
	[Clear] [bit] NULL,
	[Temp] [bit] NULL,
	PRIMARY KEY CLUSTERED 
	(
		[PersonId] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

  INSERT INTO [dbo].[People] ([Name]) Values ('Admin'), ('User')
  INSERT INTO [dbo].[People] ([Email]) Values ('admin@nomuda.com'), ('user@nomuda.com')
  INSERT INTO [dbo].[People] ([Number]) Values ('111'), ('111')
  INSERT INTO [dbo].[People] ([Password]) Values ('nomuda'), ('nomuda')
  INSERT INTO [dbo].[People] ([Clear]) Values ('1'), ('0')
  INSERT INTO [dbo].[People] ([Temp]) Values ('0'), ('0')
end