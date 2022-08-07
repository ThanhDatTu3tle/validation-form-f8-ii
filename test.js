import { Validator } from './validator.js';

// sử dụng thư viện
// Validator('id của form cần validate', 'options') {} *id của form cần validate được hiểu là formSelector

var form =  new Validator('#register-form'); // nhận lại đối tượng 'form' khi khởi tạo constructor Validator

form.onSubmit = (formData) => { // đối tượng 'form' dùng để call API
    console.log(formData);
}
