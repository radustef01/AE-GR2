const obj = {
    name: "Radu",
    greet: function() {
        //console.log("Hello, " + this.name);
        console.log(`Hello, ${this.name}`);
    },
    greet2:() => {
        console.log(`Hello, ${this.name}`);
    }
}

obj.name = "Chivu";
obj.age=26;
//obj.greet()
//console.log(obj.age);

const product = {
    price:25,
    name: "bottle",
    description: "Aqua carpatica"
}

const product2 = {
    ...product,
    price:30
}

console.log(product2);






