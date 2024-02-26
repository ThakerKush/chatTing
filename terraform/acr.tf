terraform {
  backend "local" {
    path = "../terraform.tfstate"

  }
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0.2"
    }
    azuread = {
      source  = "hashicorp/azuread"
      version = "~> 2.15.0"
    }
  }

  required_version = ">= 1.1.0"
}

provider "azurerm" {
  features {
  }
}


# Create the resource group
resource "azurerm_resource_group" "rg_chat_ting" {
  name     = lower("${var.acr_rg_name}-${local.enviroment}")
  location = var.acr_location
  tags     = merge(local.default_tags)
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

#Creating log analytics workspace
resource "azurerm_log_analytics_workspace" "log_analytics" {
  name                = lower("${var.acr_rg_name}-${local.enviroment}-log-analytics")
  location            = var.log_analytics_location
  resource_group_name = azurerm_resource_group.rg_chat_ting.name
  sku                 = "PerGB2018"
  retention_in_days   = var.acr_log_analytics_retention_days
  tags                = merge(local.default_tags)
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
}

#create the container registry

resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = azurerm_resource_group.rg_chat_ting.name
  location            = azurerm_resource_group.rg_chat_ting.location
  sku                 = var.acr_sku
  admin_enabled       = var.acr_admin_enabled
  tags                = merge(local.default_tags, var.acr_tags)
  lifecycle {
    ignore_changes = [
      tags
    ]
  }
  depends_on = [
    azurerm_resource_group.rg_chat_ting,
    azurerm_log_analytics_workspace.log_analytics
  ]
}

# create Diagnostics Settings for ACR
resource "azurerm_monitor_diagnostic_setting" "diag_acr" {
  name                       = "DiagnosticsSettings"
  target_resource_id         = azurerm_container_registry.acr.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.log_analytics.id


  log {
    category = "ContainerRegistryRepositoryEvents"
    enabled  = true
  }
  log {
    category = "ContainerRegistryLoginEvents"
    enabled  = true
  }
  metric {
    category = "AllMetrics"
    enabled  = true
  }
}
