import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { Query } from 'appwrite';
import { useSelector } from 'react-redux';

function AllPosts() {
    const [posts, setPosts] = useState([])
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (userData?.$id) {
            appwriteService.getPosts([Query.equal("userid", userData.$id)]).then((posts) => {
                if (posts) {
                    const myPosts = posts.documents.filter((post) => post.userid === userData.$id)
                    setPosts(myPosts)
                }
            }).catch(() => {
                // Fallback client-side filtering if Appwrite query index is not present
                appwriteService.getPosts().then((posts) => {
                    if (posts) {
                        const myPosts = posts.documents.filter((post) => post.userid === userData.$id)
                        setPosts(myPosts)
                    }
                })
            })
        }
    }, [userData])

  return (
    <div className='w-full py-8'>
        <Container>
            {posts.length === 0 ? (
                <div className='text-center py-8'>
                    <h2 className='text-xl font-semibold text-gray-600'>No posts found for your account.</h2>
                </div>
            ) : (
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            )}
        </Container>
    </div>
  )
}

export default AllPosts