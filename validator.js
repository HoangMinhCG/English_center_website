

//Đối tượng 'validator'
function Validator(options){
    //Sử dụng đồng thời nhiều rules mà không bị ghi đè
    var selectorRules = {}; //mong muốn hàm forEach chạy xong sẽ lưu tất cả rule vào đây


    //Hàm thực hiện validate
    function validate(inputElement, rule) {    
        // console.log('blur'+ rule.selector); hthi5  blur #fullname
        //validate, ktra xem khi blur thì ng dùng nhập gì chưa
        //có thể lấy value qua: inputElement.value
        //có thể lấy hàm test qua rule.test()
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)//errorSelector dc gán giá trị bên file cript
         var errorMessage //= rule.test(inputElement.value);
        // console.log(errorMessage)


        //Lấy ra các rules của chính selector
        var rules = selectorRules[rule.selector];
        // console.log(rules) bấm blur nào ra [f] của nó ( rule của nó)
        //validate từng rule, lặp qua từng rule và kiểm tra
        //nếu có lỗi thì dừng ktra
        for(var i = 0; i < rules.length; ++i){
            errorMessage = rules[i](inputElement.value); //rules[i] là 1 hàm nên có thể truyển value
            if(errorMessage) break;
        }

        if (errorMessage){//có lỗi
            //đang đứng thẻ input #fullname, muốn hiện lỗi màu đỏ thì phải di chuyển đến .form-message
            //inputElement.parentElement là đi ra thẻ cha, sau đó truy cập vào .form-message là thẻ con bên trong

            //truy cập dc vào rồi thì inner text nội dung cho nó
            inputElement.parentElement.classList.add('invalid')
            errorElement.innerText = errorMessage;
        } else {
            inputElement.parentElement.classList.remove('invalid')
            errorElement.innerText = '';
        }

        return !errorMessage;
    }

    // console.log(options.rules)
    //getElement của form cần validate
    var formElement = document.querySelector(options.form);
    
    if(formElement){        
        // console.log(formElement);

        //bỏ đi hvi mặc định khi nhấn nút submit
        formElement.onsubmit = function(e){
            e.preventDefault()

            var isFormValid = true;

            //Thực hiện lặp qua từng rule và validate. Nghĩa là khi không điền gì hết, bấm submit, nó sẽ đỏ hết lên
            options.rules.forEach(function (rule){
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule)

                //ktra xem có lỗi nhập dữ liệu k, hk thì tiến hành in dữ liệu bên tab console

                if(!isValid){
                    isFormValid = false;
                }

                
                if(isFormValid){
                    // console.log('k lỗi')        
                    
                    
                    //Trường hợp submit với JS   
                    if( typeof options.onsubmit === 'function'){

                        //Lấy tất cả input ở trạng thái enable
                        var enableInputs = formElement.querySelectorAll('[name]:not([disable])')//lấy những cái có attribute là name và k có attribute là disable
                        //console.log(enableInputs); //trả vể input mà ta blur
        
                        //Chuyển enableInputs sang array để có thể sử dụng pthuc reduce
                        var formValues = Array.from(enableInputs).reduce(function(values, input){//input là inputElement
                            values[input.name] = input.value;
                            return  values; //gán inputValue cho objValue  //trường hợp chưa điền gì mà submit thì input.value bằng giá trị rỗng
                            //Khi input.value có giá trị thì với toán tử && thì luôn sẽ return giá trị nằm cuối, tức là return values
                        }, {}) //inital value(gia trị khởi tạo ban đầu thường là obj rỗng)

                        options.onsubmit(formValues)
                    } else { //Trường hợp submit với hành vi mặc định (html)
                        formElement.submit() //tự động submit với hành vi mặc định khi nhập đúng hết dữ liệu
                    }
                } //else {
                //     // console.log('có lỗi')
                // }
            })
        }



        //Bắt sk blur ra khỏi input báo lỗi: get dc E của nó, lắng nghe sk onblur
        //Duyệt qua array: Lặp qua mỗi rule, xử lý( lắng nghe sk blue, input,...)
        options.rules.forEach(function (rule){

            //Lưu lại tất cả các rules cho tất cả input
            if(Array.isArray(selectorRules[rule.selector])){ //biến obj này thành mảng
                //thằng nào 2 rule thì lần 1 dc biến thành mảng rồi, nên lần 2 chắc chắn là mảng, nên chắc chắn vô đây
                selectorRules[rule.selector].push(rule.test);
            } else {//nếu thằng nào chỉ 1 rule thì vô đây để biến thành array
                selectorRules[rule.selector] = [rule.test] //Dùng ngoặc vuông làm key object
            }
            //console.log(selectorRules) cho ra 1 obj lưu lại tất cả các rule. VD #email: [f,f ]


            //lặp qua từng phần tử của rules, do có 2 phần tử nên sẽ in 2 lần
            // console.log(rule); 

            //lấy ra #fullname/email(selector)
            // console.log(rule.selector); 
            //Lấy 2 element của 2 thẻ input
            var inputElement = formElement.querySelector(rule.selector);
            // console.log(inputElement);  trả về 2 thẻ input

            

            //lắng nghe sk onblur
            if(inputElement){
                //Xử lý TH blur khỏi input
                inputElement.onblur = function() {
                        validate(inputElement, rule)
                }

                //Xử lý TH mỗi khi người dùng đang nhập input
                inputElement.oninput = function() {//rơi vào khi ng dùng đang gõ
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)//errorSelector dc gán giá trị bên file cript
                    inputElement.parentElement.classList.remove('invalid')
                    errorElement.innerText = '';
            }

            }
        })
    }

}


//Validator vừa là 1 func vừa là 1 obj


//Định nghĩa các rules
//Nguyên tắc cac rules:
//1. Khi có lỗi thì trả ra message lỗi
//2. Khi hợp lệ thì không trả ra gì cả (undefined)
Validator.isRequired = function(selector, message){

    return {
        selector: selector,
        //hàm ktra ntn bắt buộc nhập
        test: function(value){
            return value.trim() ? undefined :  message || 'Vui lòng nhập trường này' //trim để loại bỏ khoảng cách 2 bên đầu đuôi chuỗi
        }
    }
}


Validator.isEmail = function(selector, message){

    return {
        selector: selector,
        //hàm ktra ntn bắt buộc nhập
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :  message || 'Trường này phải là email'
        }
    }
}

//độ dài tối thiểu cho mật khẩu
Validator.minLength = function(selector, min, message){

    return {
        selector: selector,
        //hàm ktra ntn bắt buộc nhập
        test: function(value){            
            return value.length >= min ? undefined :  message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message){

    return {
        selector: selector,
        test: function(value){    
            //getConfirmValue là giá trị mong muốn ng dùng nhập vào
            //value là giá trị ng dùng nhập vào
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}


