IF OBJECT_ID(N'dbo.Log', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[Log](
	[LogID] [int] IDENTITY(1,1) NOT NULL,
	[LockName] [varchar](50) NULL,
	[Name] [varchar](50) NULL,
	[Time] [varchar](max) NULL,
	[Status] [varchar](max) NULL,
	 CONSTRAINT [PK_Log] PRIMARY KEY CLUSTERED 
	(
		[LogID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

end