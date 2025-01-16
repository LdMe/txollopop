
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
async function fetchData(route,method,data) {
    try {
        let url = new URL(route, BASE_URL);
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }

        }
        if(method === 'POST' || method === 'PUT'){
            fetchOptions.body = JSON.stringify(data);
        }else{
            for(const key in data){
                url.searchParams.append(key,data[key]);
            }
        }
        const response = await fetch(url.toString(),fetchOptions);
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

async function getProducts(){
    return await fetchData(`products`);
}

async function createChat(product,buyer){
    return await fetchData(`chat`, 'POST',{product:product._id,buyer,seller:product.owner});
}
async function getChat(chatId){
    return await fetchData(`chat/${chatId}`);
}

async function sendMessage(sender,message,chatId){
    return await fetchData(`chat/${chatId}`, 'POST',{message,sender});
}

export {
    login,
    register,
    getProducts,
    createChat,
    getChat,
    sendMessage
}
