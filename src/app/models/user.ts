export interface User {
  id: number
  name: string
  active: number
  isEditing: boolean
  editName:string
  // for version 2
  cidade: string
  editCidade: string
  /* for version 3 */
  email: string
  editEmail: string
  
}
