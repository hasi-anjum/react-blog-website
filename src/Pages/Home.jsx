import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import { Query } from 'appwrite';
import {Container, PostCard} from '../components'
import { useSelector } from 'react-redux';

function Home() {
    const [posts, setPosts] = useState([])
    const userData = useSelector((state) => state.auth.userData)
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        if (authStatus && userData?.$id) {
            appwriteService.getPosts([Query.equal("userid", userData.$id)]).then((posts) => {
                if (posts) {
                    const myPosts = posts.documents.filter((post) => post.userid === userData.$id)
                    setPosts(myPosts)
                }
            }).catch(() => {
                // Fallback client-side filtering
                appwriteService.getPosts().then((posts) => {
                    if (posts) {
                        const myPosts = posts.documents.filter((post) => post.userid === userData.$id)
                        setPosts(myPosts)
                    }
                })
            })
        } else {
            setPosts([])
        }
    }, [authStatus, userData])
  
    if (!authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold text-gray-600">
                                No posts created yet. Go to "Add Post" to create your first post!
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home