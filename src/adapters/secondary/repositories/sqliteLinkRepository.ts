﻿import {ILinkRepository} from "../../../application/adapters/secondary/repositories/iLinkRepository";
import {Link} from "../../../application/models/link";
import {Database, open} from "sqlite";
import sqlite3 from "sqlite3";
import {undefined} from "zod";

export class SqliteLinkRepository implements ILinkRepository {
    public isInitialized: boolean = false
    private db?: Database
    
    async init() {
        this.db = await open({
            filename: "./tmp.db",
            driver: sqlite3.Database
        })
        
        await this.db.exec("CREATE TABLE IF NOT EXISTS Link(originalUrl TEXT NOT NULL UNIQUE, clicksCnt INT NOT NULL DEFAULT 0)")
        this.isInitialized = true
    }
    
    async create(link: Link): Promise<Link> {
        if(!this.isInitialized) {
            throw new Error("invalid operation : must init first")
        }
        await this.db!.run("INSERT INTO Link(originalUrl, clicksCnt) VALUES(:url, 0)", { ":url": link.originalUrl })
        return Object.assign(new Link(""), await this.db!.get("SELECT rowid as id, originalUrl, clicksCnt FROM Link WHERE originalUrl= :url", { ":url": link.originalUrl }) as Link)
    }

    async findById(id: number): Promise<Link> {
        return Object.assign(new Link(""), await this.db!.get("SELECT rowid as id, originalUrl, clicksCnt FROM Link WHERE rowid= :id", { ":id": id }) as Link)
    }
    
    async empty(): Promise<void> {
        await this.db!.run("DELETE FROM Link")
    }

    async update(link: Link): Promise<Link> {
        if(!this.isInitialized) {
            throw new Error("invalid operation : must init first")
        }
        await this.db!.run("UPDATE Link set clicksCnt= :cnt WHERE originalUrl = :url", { ":url": link.originalUrl, ":cnt": link.clicksCnt })
        return Object.assign(new Link(""), await this.db!.get("SELECT rowid as id, originalUrl, clicksCnt FROM Link WHERE originalUrl= :url", { ":url": link.originalUrl }) as Link)
    }

    async getAll(): Promise<Link[]> {
        const links = await this.db!.all<Link[]>("SELECT rowid as id, originalUrl, clicksCnt FROM Link")
            
        return links.map(
            (link: Link) => Object.assign(new Link(""), link)
        )
    }
}
