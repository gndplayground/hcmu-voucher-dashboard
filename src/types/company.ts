export interface Company {
  id: number
  name: string
  phone?: string
  address?: string
  logo?: string
  website?: string
  createdAt: string
  isDisabled?: boolean
  isDeleted?: boolean
}

export interface CompanyCreate {
  name: string
  phone?: string
  address?: string
  logo?: string
  website?: string
}

export interface CompanyUpdate {
  name?: string
  phone?: string
  address?: string
  logo?: string
  website?: string
  isDeleted?: boolean
}
