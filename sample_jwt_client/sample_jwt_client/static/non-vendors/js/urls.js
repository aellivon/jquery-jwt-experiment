// Note: This might not be the best practice!
// This stores all our constansts and urls
// Api urls
base_server_url = "http://127.0.0.1:8000/";
login_api_url = base_server_url + "api/users/login/";
sample_product_api_url = base_server_url + "api/sample_products/"

//--------------------------------------------------------------------

// Frontend urls shouldn't be static and should be reverse from a routing system!
// In short this is bad practice!

// Maybe I should have made the django router reverse this?
index_url = base_front_end_url +  'index/';
login_url = base_front_end_url + '';