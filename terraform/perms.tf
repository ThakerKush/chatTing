

provider "azuread" {

}


resource "azurerm_key_vault" "chat_vault" {
  name                        = "chatvault"
  location                    = azurerm_resource_group.rg_chat_ting.location
  resource_group_name         = azurerm_resource_group.rg_chat_ting.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azuread_client_config.current.tenant_id
  soft_delete_retention_days  = 7
  purge_protection_enabled    = false

  sku_name = "standard"

  access_policy {
    tenant_id = data.azuread_client_config.current.tenant_id
    object_id = data.azuread_client_config.current.object_id

    key_permissions = [
      "Get",
    ]

    secret_permissions = [
      "Get",
    ]

    storage_permissions = [
      "Get",
    ]
  }
  access_policy {
    tenant_id = data.azuread_client_config.current.tenant_id
    object_id = var.admin_object_id

     key_permissions = [
      "Get", "List", "Update", "Create", "Import", "Delete", "Recover", "Backup", "Restore",
    ]

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Recover", "Backup", "Restore",
    ]

    storage_permissions = [
      "Get", "List", "Delete", "Set", "Update", "RegenerateKey", "Recover", "Backup", "Restore",
    ]
  }
}


resource "azuread_application" "pull_sp_app" {
  display_name = "pullspapp"
  owners       = [data.azuread_client_config.current.object_id]
}

resource "azuread_service_principal" "pull_sp" {
  application_id = azuread_application.pull_sp_app.application_id
  owners         = [data.azuread_client_config.current.object_id]
}

resource "azuread_service_principal_password" "pull_sp_password" {
  service_principal_id = azuread_service_principal.pull_sp.id
  end_date             = "2025-01-01T01:02:03Z"
}

resource "azuread_application" "push_sp_app" {
  display_name = "pushspapp"
  owners       = [data.azuread_client_config.current.object_id]
}

resource "azuread_service_principal" "push_sp" {
  application_id = azuread_application.push_sp_app.application_id
  owners         = [data.azuread_client_config.current.object_id]
}

resource "azuread_service_principal_password" "push_sp_password" {
  service_principal_id = azuread_service_principal.push_sp.id
  end_date             = "2025-01-01T01:02:03Z"
}

resource "azurerm_role_assignment" "pull_role_assignment" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azuread_service_principal.pull_sp.id
}

resource "azurerm_role_assignment" "push_role_assignment" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPush"
  principal_id         = azuread_service_principal.push_sp.id
}

data "azurerm_key_vault_secret" "pg-admin-password" {
  name         = "pg-admin-password"  # replace with the name of your secret
  key_vault_id = azurerm_key_vault.chat_vault.id
}

output "db_password" {
  value = data.azurerm_key_vault_secret.pg-admin-password.value
  description = "The database password"
  sensitive = true
}