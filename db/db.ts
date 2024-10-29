import mariadb from 'mariadb'

export class Mariadb {
    private pool: mariadb.Pool;

    constructor(host: string, user: string, password: string, database: string, connectionLimit: number) {
        this.pool = mariadb.createPool({
            host,
            user,
            password,
            database,
            connectionLimit,
            charset: 'utf8mb4_unicode_ci',
            timezone: '+00:00'
        })
    }

    public async connect(): Promise<  mariadb.PoolConnection | null> {
       let conn: mariadb.PoolConnection;
       try {
          conn = await this.pool.getConnection()
          return conn
       }catch(err) {
        console.error('Error connecting to MariaDB:', err)
        return null
       } 
    }

    public async closePool():Promise<boolean >{
        try{
            this.pool.end()
            return true
        }catch(err) {
            console.error('Error closing MariaDB pool:', err)
            return false
        }
    }
}