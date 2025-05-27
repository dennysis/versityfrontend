// Simple JSON database simulation using localStorage
export class JSONDatabase {
  private dbName: string;
  private tables: Map<string, any[]> = new Map();

  constructor(dbName: string = 'versity_db') {
    this.dbName = dbName;
    this.loadFromStorage();
  }

  // Load database from localStorage
  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    
    try {
      const stored = localStorage.getItem(this.dbName);
      if (stored) {
        const data = JSON.parse(stored);
        this.tables = new Map(Object.entries(data));
      }
    } catch (error) {
      console.error('Failed to load database from storage:', error);
    }
  }

  // Save database to localStorage
  private saveToStorage(): void {
    if (typeof window === "undefined") return;
    
    try {
      const data = Object.fromEntries(this.tables);
      localStorage.setItem(this.dbName, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save database to storage:', error);
    }
  }

  // Create or get table
  table(name: string): any[] {
    if (!this.tables.has(name)) {
      this.tables.set(name, []);
    }
    return this.tables.get(name)!;
  }

  // Insert record
  insert(tableName: string, record: any): any {
    const table = this.table(tableName);
    const id = record.id || Date.now() + Math.random();
    const newRecord = { ...record, id, createdAt: new Date().toISOString() };
    
    table.push(newRecord);
    this.saveToStorage();
    return newRecord;
  }

  // Find records
  find(tableName: string, query?: (item: any) => boolean): any[] {
    const table = this.table(tableName);
    return query ? table.filter(query) : [...table];
  }

  // Find one record
  findOne(tableName: string, query: (item: any) => boolean): any | null {
    const table = this.table(tableName);
    return table.find(query) || null;
  }

  // Update record
  update(tableName: string, id: any, updates: any): any | null {
    const table = this.table(tableName);
    const index = table.findIndex(item => item.id === id);
    
    if (index !== -1) {
      table[index] = { 
        ...table[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      };
      this.saveToStorage();
      return table[index];
    }
    
    return null;
  }

  // Delete record
  delete(tableName: string, id: any): boolean {
    const table = this.table(tableName);
    const index = table.findIndex(item => item.id === id);
    
    if (index !== -1) {
      table.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    
    return false;
  }

  // Clear table
  clearTable(tableName: string): void {
    this.tables.set(tableName, []);
    this.saveToStorage();
  }

  // Export database
  export(): string {
    const data = Object.fromEntries(this.tables);
    return JSON.stringify(data, null, 2);
  }

  // Import database
  import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.tables = new Map(Object.entries(data));
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import database:', error);
      return false;
    }
  }
}

// Create a default database instance
export const db = new JSONDatabase();