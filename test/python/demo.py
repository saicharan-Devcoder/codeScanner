# This program calculates the area and perimeter of a rectangle.

# Function to calculate the area of a rectangle
def calculate_area(length, width):
    """
    This function takes two arguments:
    1. length: The length of the rectangle
    2. width: The width of the rectangle
    It returns the area of the rectangle using the formula:
    Area = length * width
    """
    return length * width


# Function to calculate the perimeter of a rectangle
def calculate_perimeter(length, width):
    """
    This function calculates the perimeter of a rectangle.
    Formula: Perimeter = 2 * (length + width)
    """
    return 2 * (length + width)


# Main block to execute the program
def main():
    """
    This is the main block where the program begins.
    The user is prompted to enter the length and width of the rectangle.
    """
    # Prompting the user for input
    print("Welcome to the Rectangle Calculator!")
    
    # Get length and width from the user
    length = float(input("Enter the length of the rectangle: "))
    width = float(input("Enter the width of the rectangle: "))

    # Calculate area and perimeter
    area = calculate_area(length, width)
    perimeter = calculate_perimeter(length, width)

    # Display the results
    print("\n--- Results ---")
    print(f"Area of the rectangle: {area}")
    print(f"Perimeter of the rectangle: {perimeter}")


# Entry point of the program
if __name__ == "__main__":
    main()
