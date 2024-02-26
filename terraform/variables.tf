variable "acr_name" {
  description = "(Required) Specifies the name of the Container Registry. Changing this forces a new resource to be created."
  type        = string
}
variable "acr_rg_name" {
  description = "(Required) The name of the resource group in which to create the Container Registry. Changing this forces a new resource to be created."
  type        = string
}
variable "acr_location" {
  description = "Location in which to deploy the Container Registry"
  type        = string
  default     = "East US"
}
variable "acr_admin_enabled" {
  description = "(Optional) Specifies whether the admin user is enabled. Defaults to false."
  type        = string
  default     = false
}
variable "acr_sku" {
  description = "(Optional) The SKU name of the container registry. Possible values are Basic, Standard and Premium. Defaults to Basic"
  type        = string
  default     = "Basic"
  validation {
    condition     = contains(["Basic", "Standard", "Premium"], var.acr_sku)
    error_message = "The container registry sku is invalid."
  }
}

variable "acr_log_analytics_retention_days" {
  description = "Specifies the number of days of the retention policy"
  type        = number
  default     = 7
}
variable "acr_tags" {
  description = "(Optional) Specifies the tags of the ACR"
  type        = map(any)
  default     = {}
}
variable "data_endpoint_enabled" {
  description = "(Optional) Whether to enable dedicated data endpoints for this Container Registry? Defaults to false. This is only supported on resources with the Premium SKU."
  default     = true
  type        = bool
}
variable "log_analytics_location" {
  description = "Specifies the location of the log analytics workspace"
  type        = string
  default     = "Central India"

}
variable "enviroment" {
  description = "Specifies the environment of the resource"
  type        = string
  default     = "dev"
}

variable "pg_sql_name" {
  description = "Specifies the name of the PostgreSQL Server"
  type        = string

}
data "azuread_client_config" "current" {}

variable "pg_storage_mb" {
  description = "value of the storage in MB"
  type        = number
}
variable "pg_admin_name" {
  description = "Specifies the admin name of the PostgreSQL Server"
  type        = string
  sensitive   = true
}
variable "pg_admin_password" {
  description = "Specifies the admin password of the PostgreSQL Server"
  type        = string
  sensitive   = true

}
variable "pg_sku" {
  description = "Specifies the SKU of the PostgreSQL Server"
  type        = string
}
variable "pg_version" {
  description = "Specifies the version of the PostgreSQL Server"
  type        = string
}
variable "pg_backup_retention_days" {
  description = "Specifies the backup retention days of the PostgreSQL Server"
  type        = number
  default     = 7
}
variable "pg_charset" {
  description = "Specifies the charset of the PostgreSQL Server"
  type        = string
}
variable "pg_collation" {
  description = "Specifies the collation of the PostgreSQL Server"
  type        = string
}
variable "pg_db_name" {
  description = "Specifies the name of the PostgreSQL Database"
  type        = string
}
variable "admin_object_id"{
  description = "Specifies the object id of the admin"
  type        = string

}
locals {
  enviroment = var.enviroment
  default_tags = {
    Environment = var.enviroment,
    Project     = "chat-ting",

  }
}
