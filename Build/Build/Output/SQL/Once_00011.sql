IF OBJECT_ID(N'dbo.ScheduleKeys', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[ScheduleKeys](
	[ScheduleKeyID] [int] IDENTITY(1,1) NOT NULL,
	[ScheduleID] [int] NULL,
	[KeyID] [int] NULL,
	 CONSTRAINT [PK_ScheduleKeys] PRIMARY KEY CLUSTERED 
	(
		[ScheduleKeyID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[ScheduleKeys]  WITH CHECK ADD FOREIGN KEY([KeyID])
	REFERENCES [dbo].[Keys] ([KeyID])
	ON DELETE CASCADE

	ALTER TABLE [dbo].[ScheduleKeys]  WITH CHECK ADD FOREIGN KEY([ScheduleID])
	REFERENCES [dbo].[Schedule] ([ScheduleID])
	ON DELETE CASCADE
end