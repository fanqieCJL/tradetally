/** Chinese translations for Backup Management (admin) */
export const backupManagementZhCN = {
  'Backup Management': '备份管理',
  'Configure automatic backups and manage full site exports':
    '配置自动备份并管理全站导出',
  'Backup Settings': '备份设置',
  'Backup Warnings': '备份警告',
  'Storage Warnings': '存储警告',
  'Automatic Backups': '自动备份',
  'Enable scheduled automatic backups of all site data':
    '启用定时自动备份全部站点数据',
  'Backup Schedule': '备份计划',
  Hourly: '每小时',
  'Daily (2 AM)': '每天（凌晨 2 点）',
  'Weekly (Sunday 2 AM)': '每周（周日凌晨 2 点）',
  'Monthly (1st day, 2 AM)': '每月（1 日 凌晨 2 点）',
  hourly: '每小时',
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
  'Retention Period (days)': '保留天数',
  'Backups older than this will be automatically deleted':
    '超过此天数的备份将自动删除',
  'Last automatic backup:': '上次自动备份：',
  'Manual Backup': '手动备份',
  'Create an immediate backup of all site data': '立即备份全部站点数据',
  'Creating...': '创建中…',
  'Create Backup Now': '立即创建备份',
  'Backup History': '备份历史',
  '1 backup': '1 个备份',
  '{count} backups': '{count} 个备份',
  'No backups': '暂无备份',
  'Get started by creating your first backup': '创建第一个备份以开始使用',
  Filename: '文件名',
  Type: '类型',
  Size: '大小',
  Status: '状态',
  Created: '创建时间',
  Actions: '操作',
  manual: '手动',
  automatic: '自动',
  completed: '已完成',
  failed: '失败',
  'Downloading...': '下载中…',
  Download: '下载',
  'Deleting...': '删除中…',
  'Restore from Backup': '从备份恢复',
  'Upload a backup file to restore site data. This will add missing data without deleting existing records.':
    '上传备份文件以恢复站点数据。将补充缺失数据，不会删除已有记录。',
  'Select Backup File': '选择备份文件',
  'Cleanup Old Backups': '清理旧备份',
  'Manually delete backups older than the retention period':
    '手动删除超过保留期的备份',
  'Cleaning...': '清理中…',
  'Run Cleanup': '执行清理',
  'Confirm Backup Restore': '确认恢复备份',
  'You are about to restore data from:': '即将从以下文件恢复数据：',
  'Full snapshot restore': '完整快照恢复',
  'Clear all existing data before restoring. Restores the server to the exact state captured in the backup.':
    '恢复前清空所有现有数据，将服务器还原为备份中的确切状态。',
  'Overwrite matching users data': '覆盖匹配用户的数据',
  'Update existing users with data from the backup (name, settings, etc.)':
    '使用备份中的数据更新已有用户（姓名、设置等）',
  'Destructive Operation': '破坏性操作',
  Warning: '警告',
  'ALL existing data will be permanently deleted before restoring':
    '恢复前将永久删除所有现有数据',
  'The server will be reset to the exact state in the backup file':
    '服务器将重置为备份文件中的确切状态',
  'This will restore users, trades, and other data from the backup':
    '将从备份恢复用户、交易及其他数据',
  'Existing records with the same ID will be skipped':
    '相同 ID 的已有记录将被跳过',
  'Existing users will be UPDATED with backup data':
    '已有用户将使用备份数据更新',
  'New records from the backup will be added': '将添加备份中的新记录',
  'This action may take several minutes for large backups':
    '大型备份可能需要数分钟',
  'Restoring...': '恢复中…',
  'Restore Backup': '恢复备份',
  'Failed to load backup data': '加载备份数据失败',
  'Settings saved successfully': '设置已保存',
  'Failed to save settings': '保存设置失败',
  'Backup created successfully: {filename}': '备份创建成功：{filename}',
  'Failed to create backup': '创建备份失败',
  'Failed to download backup': '下载备份失败',
  'Delete Backup': '删除备份',
  'Are you sure you want to delete this backup? This action cannot be undone.':
    '确定要删除此备份吗？此操作无法撤销。',
  'Backup deleted successfully': '备份已删除',
  'Failed to delete backup': '删除备份失败',
  'Cleanup Backups': '清理备份',
  'Delete backups older than {days} days?': '删除超过 {days} 天的备份？',
  'Failed to cleanup backups': '清理备份失败',
  'No backup file selected': '未选择备份文件',
  'Restore failed': '恢复失败',
  'Automatic backup scheduler is disabled by environment configuration.':
    '环境配置已禁用自动备份调度器。',
  'Backups are disabled in backup settings.': '备份设置中已禁用备份。',
  'No successful backup has been recorded yet.': '尚无成功备份记录。',
  'Last backup is stale for the configured {schedule} schedule.':
    '按当前 {schedule} 计划，上次备份已过期。',
  'Backups are stored on the app host filesystem only.':
    '备份仅存储在应用主机文件系统中。',
  'Uploaded assets are stored on the app host filesystem.':
    '上传资源仅存储在应用主机文件系统中。',
  'Upload directories are not initialized yet: {dirs}.':
    '上传目录尚未初始化：{dirs}。',
  '{count} users': '{count} 位用户',
  '{count} users updated': '已更新 {count} 位用户',
  '{count} trades': '{count} 笔交易',
  '{count} diary entries': '{count} 条日记',
  '{count} other records': '{count} 条其他记录',
  B: 'B',
  KB: 'KB',
  MB: 'MB',
  GB: 'GB',
  'N/A': '无'
}
