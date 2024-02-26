output "acr_name" {
  description = "Specifies the name of the container registry."
  value       = azurerm_container_registry.acr.name
}
output "acr_id" {
  description = "Specifies the resource id of the container registry."
  value       = azurerm_container_registry.acr.id
}
output "acr_resource_group_name" {
  description = "Specifies the name of the resource group."
  value       = azurerm_container_registry.acr.resource_group_name
}
output "acr_login_server" {
  description = "Specifies the login server of the container registry."
  value       = azurerm_container_registry.acr.login_server
}
output "acr_login_server_url" {
  description = "Specifies the login server url of the container registry."
  value       = "https://${azurerm_container_registry.acr.login_server}"
}
output "acr_admin_username" {
  description = "Specifies the admin username of the container registry."
  value       = azurerm_container_registry.acr.admin_username
}
output "azurerm_monitor_diagnostic_setting" {
  description = "Specifies the diagnostic setting of the container registry."
  value       = azurerm_monitor_diagnostic_setting.diag_acr.id
}

output "push_sp_client_id" {
  description = "The Client ID of the Push Service Principal"
  value       = azuread_service_principal.push_sp.application_id
  sensitive   = true
}

output "push_sp_client_secret" {
  description = "The Client Secret of the Push Service Principal"
  value       = azuread_service_principal_password.push_sp_password.value
  sensitive   = true
}

output "pull_sp_client_id" {
  description = "The Client ID of the Pull Service Principal"
  value       = azuread_service_principal.pull_sp.application_id
  sensitive   = true
}

output "pull_sp_client_secret" {
  description = "The Client Secret of the Pull Service Principal"
  value       = azuread_service_principal_password.pull_sp_password.value
  sensitive   = true
}

output "pg_server_fqdn" {
  description = "The Fully Qualified Domain Name of the PostgreSQL server."
  value       = azurerm_postgresql_server.pg_chat_server.fqdn
}


output "pg_database_name" {
  description = "The name of the PostgreSQL database."
  value       = azurerm_postgresql_database.pg_chat_db.name
}