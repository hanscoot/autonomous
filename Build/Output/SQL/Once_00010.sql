IF OBJECT_ID(N'dbo.LockKeys', N'U') IS NULL 
begin
	CREATE TABLE [dbo].[LockKeys](
	[LockKeyID] [int] IDENTITY(1,1) NOT NULL,
	[LockID] [int] NULL,
	[KeyID] [int] NULL,
	 CONSTRAINT [PK_LockKeys] PRIMARY KEY CLUSTERED 
	(
		[LockKeyID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE [dbo].[LockKeys]  WITH CHECK ADD FOREIGN KEY([KeyID])
	REFERENCES [dbo].[Keys] ([KeyID])
	ON DELETE CASCADE

	ALTER TABLE [dbo].[LockKeys]  WITH CHECK ADD FOREIGN KEY([LockID])
	REFERENCES [dbo].[Locks] ([LockID])
	ON DELETE CASCADE
end