export interface ICategory {
  _id?: string;        
  name: string;        
  description?: string;
  isDeleted?: boolean; 
  createdAt?: Date;    
  updatedAt?: Date;    
}
