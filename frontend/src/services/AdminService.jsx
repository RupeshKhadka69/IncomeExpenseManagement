import configureAxios from "./ConfigureAxios";
const requests = configureAxios();

const AdminServices = {
    login(body){
     return   requests.post("user/login",body);
    }
} 

export default AdminServices;