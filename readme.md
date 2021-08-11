# Hi! My Name Is James 
This is my submission for Judy Legal's senior frontend engineer. My mum says I'm bossy because i like telling computers what to do. 

## How It Was Fixed
The file is read and processed using the FileReader functions. It separates the CSV headings from the values and process them. Everything gets stored in the textareas and the matrix (two-dimensional dynamic array).

To process the bad values, it searches for close good neighbors (west, east, north, south). If not close neighbors are found, it uses the Tesseract to find a further neighbor.
