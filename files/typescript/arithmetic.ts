/* 
  This is a multi-line comment 
  at the top of the file.
*/

function greet(name: string): void {
    console.log("Hello, " + name); // Inline single-line comment
  }
  
  greet("World");
  
  // This is a single-line comment
  
  /*
    This is another multi-line comment
    explaining the purpose of the code.
  */
  
  const add = (a: number, b: number): number => {
    return a + b;
  };
  
  console.log(add(5, 3)); // Code line
  