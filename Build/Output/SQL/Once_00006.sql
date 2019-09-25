IF OBJECT_ID(N'dbo.OneTime', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[OneTime](
	[UserID] [int] IDENTITY(1,1) NOT NULL,
	[LockID] [varchar](50) NULL,
	[Time] [varchar](50) NULL,
	[Date] [varchar](50) NULL,
	[PersonID] [int] NULL,
	[KeyID] [int] NULL,
	 CONSTRAINT [PK_OneTime] PRIMARY KEY CLUSTERED 
	(
		[UserID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

end