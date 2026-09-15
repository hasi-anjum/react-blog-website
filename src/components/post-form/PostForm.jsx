import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, watch, setValue, control, formState: { errors: formErrors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.Content || "",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setError("");
        setLoading(true);
        
        try {
            // Validate user is logged in
            if (!userData) {
                throw new Error("You must be logged in to create a post");
            }

            // Validate required fields
            if (!data.title?.trim()) {
                throw new Error("Title is required");
            }
            if (!data.slug?.trim()) {
                throw new Error("Slug is required");
            }
            if (!data.content?.trim()) {
                throw new Error("Content is required");
            }

            if (post) {
                // UPDATE POST
                const file = data.image?.[0] ? await appwriteService.uploadFile(data.image[0]) : null;

                if (file) {
                    try {
                        await appwriteService.deleteFile(post.FeaturedImage);
                    } catch (err) {
                        console.log("Error deleting old file:", err);
                    }
                }

                const dbPost = await appwriteService.updatePost(post.$id, {
                    title: data.title,
                    Content: data.content,
                    FeaturedImage: file ? file.$id : post.FeaturedImage,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                // CREATE NEW POST
                if (!data.image || !data.image[0]) {
                    throw new Error("Please select an image");
                }

                console.log("Uploading file...");
                const file = await appwriteService.uploadFile(data.image[0]);

                if (!file) {
                    throw new Error("Failed to upload image");
                }

                console.log("File uploaded successfully:", file);

                const fileId = file.$id;
                const postData = {
                    title: data.title,
                    slug: data.slug,
                    Content: data.content,
                    FeaturedImage: fileId,
                    userid: userData.$id,
                };
                
                console.log("Creating post with data:", postData);
                
                const dbPost = await appwriteService.createPost(postData);

                if (!dbPost) {
                    throw new Error("Failed to create post");
                }

                console.log("Post created successfully:", dbPost);
                navigate(`/post/${dbPost.$id}`);
            }
        } catch (err) {
            const errorMsg = err.message || "An error occurred while saving the post";
            setError(errorMsg);
            console.error("PostForm Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {error && <div className="w-full bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: "Title is required" })}
                />
                {formErrors.title && <p className="text-red-500 text-sm mb-2">{formErrors.title.message}</p>}
                
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: "Slug is required" })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                {formErrors.slug && <p className="text-red-500 text-sm mb-2">{formErrors.slug.message}</p>}
                
                <RTE label="Content :" name="content" control={control} defaultValue={post?.Content || ""} />
                {formErrors.content && <p className="text-red-500 text-sm mb-2">Content is required</p>}
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post ? "Image is required" : false })}
                />
                {formErrors.image && <p className="text-red-500 text-sm mb-2">{formErrors.image.message}</p>}
                
                {post && post.FeaturedImage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.FeaturedImage)}
                            alt={post.title}
                            className="rounded-lg"
                            onError={(event) => {
                                event.currentTarget.style.display = "none";
                            }}
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                />
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-green-500" : undefined} 
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Saving..." : post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}