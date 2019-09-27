IF OBJECT_ID(N'dbo.Schedule', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[Schedule](
	[ScheduleID] [int] IDENTITY(1,1) NOT NULL,
	[Times] [nvarchar](max) NULL,
	[Days] [nvarchar](max) NULL,
	[Number] [int] NULL,
	CONSTRAINT [PK_Schedule] PRIMARY KEY CLUSTERED 
	(
		[ScheduleID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

end