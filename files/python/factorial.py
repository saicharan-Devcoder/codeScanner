# This program calculates the factorial of a number entered by the user.

def factorial(n):
    """
    This function calculates the factorial of a given number `n` recursively.

    The factorial of a non-negative integer is defined as:
        n! = n * (n-1) * (n-2) * ... * 1
    For example:
        5! = 5 * 4 * 3 * 2 * 1 = 120

    If n is 0 or 1, the factorial is 1.
    """
    if n == 0 or n == 1:
        return 1  # Base case: factorial of 0 or 1 is 1
    else:
        return n * factorial(n - 1)  # Recursive case


def main():
    """
    The main function where the program starts.
    It prompts the user to enter a number and calculates its factorial.
    """
    print("Welcome to the Factorial Calculator!")

    # Get user input
    try:
        number = int(input("Please enter a non-negative integer: "))

        # Check if the input is a valid non-negative integer
        if number < 0:
            print("Factorial is not defined for negative numbers. Please try again.")
        else:
            # Calculate the factorial
            result = factorial(number)

            # Display the result
            print(f"\nThe factorial of {number} is: {result}")
    except ValueError:
        # Handle invalid input
        print("Invalid input. Please enter a valid non-negative integer.")


# Entry point of the program
if __name__ == "__main__":
    main()
