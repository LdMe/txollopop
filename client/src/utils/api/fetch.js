
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
async function fetchData(route, method = 'GET', data = null) {
    try {
        let url = new URL(route, BASE_URL);
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        }

        if (method === 'POST' || method === 'PUT') {
            fetchOptions.body = JSON.stringify(data);
        } else if (data) {
            Object.entries(data).forEach(([key, value]) => {
                if (typeof value === 'string' && value !== undefined && value !== null) {
                    console.log("key value",key,"|", value);
                    url.searchParams.append(key, value);
                }
            });
        }
        console.log(data);
        const response = await fetch(url.toString(), fetchOptions);
        return response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function login(email,password){
    return await fetchData(`login`, 'POST',{email,password});
}

async function register(name,email,password,passwordRepeat){
    return await fetchData(`register`, 'POST',{name,email,password,passwordRepeat});
}

async function getProducts(excludeOwner = null, category = null) {
    console.log("excludeOwner, category",excludeOwner, category);
    return await fetchData('products', 'GET', { excludeOwner, category });
}

async function getMyProducts(userId) {
    return await fetchData(`user/${userId}/products`, 'GET');
}
async function createProduct(formData) {
    const response = await fetch(`${BASE_URL}/product`, {
        method: 'POST',
        body: formData
    });
    return response.json();
}
async function deleteProduct(productId) {
    return await fetchData(`product/${productId}`, 'DELETE');
}

async function createChat(product,buyer){
    return await fetchData(`chat`, 'POST',{product:product._id,buyer,seller:product.owner});
}
async function getChat(chatId){
    const result =  await fetchData(`chat/${chatId}`);
    console.log("result",result);
    return result;
}

async function sendMessage(sender,message,chatId){
    return await fetchData(`chat/${chatId}`, 'POST',{message,sender});
}

export {
    login,
    register,
    getProducts,
    getMyProducts,
    createProduct,
    deleteProduct,
    createChat,
    getChat,
    sendMessage
}
