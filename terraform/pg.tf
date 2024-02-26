resource "azurerm_postgresql_server" "pg_chat_server" {
  name                = var.pg_sql_name
  location            = var.acr_location
  resource_group_name = azurerm_resource_group.rg_chat_ting.name
  sku_name            = var.pg_sku


  backup_retention_days        = var.pg_backup_retention_days
  version                      = var.pg_version
  storage_mb                   = var.pg_storage_mb
  administrator_login          = var.pg_admin_name
  administrator_login_password = var.pg_admin_password
  ssl_enforcement_enabled      = true


  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_postgresql_database" "pg_chat_db" {
  name                = var.pg_db_name
  resource_group_name = azurerm_resource_group.rg_chat_ting.name
  server_name         = azurerm_postgresql_server.pg_chat_server.name
  charset             = var.pg_charset
  collation           = var.pg_collation


  lifecycle {
    prevent_destroy = true
  }
}