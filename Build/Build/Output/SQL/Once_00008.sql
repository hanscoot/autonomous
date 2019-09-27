IF OBJECT_ID(N'dbo.LockType', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[LockType](
	[LockTypeID] [int] IDENTITY(1,1) NOT NULL,
	[Type] [nvarchar](max) NULL,
	[IP] [nvarchar](max) NULL,
	[OutputPort] [int] NULL,
	[InputPort] [int] NULL,
	[Delay] [int] NULL,
	 CONSTRAINT [PK_LockType] PRIMARY KEY CLUSTERED 
	(
		[LockTypeID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

end