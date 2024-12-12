// Single-line comment at the top of the file

function isEven(num: number): boolean {
    /*
      Multi-line comment inside a function.
      Checks whether the number is even.
    */
    return num % 2 === 0; // Inline comment
  }
  
  console.log(isEven(4)); // Code line
  
  /*
    Standalone multi-line comment
    outside of any function.
  */
  
  let counter = 0; // Variable initialization
  
  for (let i = 0; i < 5; i++) {
    counter += i; // Add to counter
  }
  
  console.log("Counter:", counter); // Print the counter value
  