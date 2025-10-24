variable "flow" {
  type    = string
  default = "24-01"
}

variable "cloud_id" {
  type    = string
  default = "b1gsk2bfdl9e6h6ilouc"
}
variable "folder_id" {
  type    = string
  default = "b1g0nbbtab0kcgkrf9qu"
}

variable "test" {
  type = map(number)
  default = {
    cores         = 2
    memory        = 1
    core_fraction = 20
  }
}

