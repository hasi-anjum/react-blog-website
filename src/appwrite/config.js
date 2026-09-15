import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Permission, Role } from 'appwrite'

export class Service {
    client = new Client()
    databases
    bucket


    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
    }


    async createPost({ title, slug, Content, FeaturedImage, userid }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    Content,
                    FeaturedImage,
                    userid,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
            throw error;
        }
    }

    async updatePost(slug, { title, Content, FeaturedImage }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    Content,
                    FeaturedImage
                }
            )
        } catch (error) {
            console.log("Appwrite Service :: UpdatePost :: error ", error);
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log("Appwrite :: Delete Post Error :: Error:", error)
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("Appwrite Service :: GetPost Error :: Error : ", error)
            return false
        }
    }

    async getPosts(queries = []) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("Appwrite Service :: GetPosts Error :: Error : ", error)
            return false
        }
    }

    //file upload services

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [Permission.read(Role.any())],
            )
        } catch (error) {
            console.log("Appwrite Service :: upload File Error :: Error : ", error)
        }
    }

    async deleteFile(fileID) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileID
            )
            return true

        } catch (error) {
            console.log("Appwrite Service :: DeleteFile :: Error: ", error)
            return false
        }
    }

    getFilePreview(fileID) {
        if (!fileID) {
            return "https://via.placeholder.com/400x300?text=No+Image";
        }
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileID
        ).toString()
    }
}

const service = new Service()
export default service