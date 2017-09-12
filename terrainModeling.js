

//-------------------------------------------------------------------------
//diamond step in diamond-square algorithm
//@param x: current x coordinate
//@param y: current y coordinate
//@param size: steps/distance to neighboring points used to perform calculation
//@param offset: current offset for height
//@param terrainArray: 2-D array used to store heightmap
//@param arraySize: dimension of terrainArray
function diamond(x, y, size, offset, terrainArray, arraySize){
    var a;
    var b;
    var c;
    var d;
    if(y-size >= 0){
        a = terrainArray[x][y-size];
    }
    else{
        a = 0;
    }
    if(x+size < arraySize)
        {
            b = terrainArray[x+size][y];
        }
    else{
        b = 0;
    }
    if(y+size < arraySize){
        c = terrainArray[x][y+size];
    }
    else{
        c = 0;
    }
    if(x-size >= 0){
        d = terrainArray[x-size][y];
    }
    else{
        d = 0;
    }
   
        terrainArray[x][y] = ((a+b+c+d)/4) + offset;
    
}
//square step in diamond-square algorithm
//@param x: current x coordinate
//@param y: current y coordinate
//@param size: steps/distance to neighboring points used to perform calculation
//@param offset: current offset for height
//@param terrainArray: 2-D array used to store heightmap
//@param arraySize: dimension of terrainArray
function square(x, y, size, offset, terrainArray,arraySize){
    var a;
    var b;
    var c;
    var d;
    if(x-size >= 0 && y-size >= 0){
        a = terrainArray[x-size][y-size];
    }
    else{
        a = 0;
    }
    if(x+size < arraySize && y-size >= 0)
        {
            b = terrainArray[x+size][y-size];
        }
    else{
        b = 0;
    }
    if(x+size < arraySize && y+size < arraySize){
        c = terrainArray[x+size][y+size];
    }
    else{
        c = 0;
    }
    if(x-size >= 0 && y+size < arraySize){
        d = terrainArray[x-size][y+size];
    }
    else{
        d = 0;
    }
   
        terrainArray[x][y] = ((a+b+c+d)/4) + offset;
    
    
}
//recursive function to generate values for heightmap
//@param size: steps/distance to neighboring points used to perform calculations
//@param terrainArray: 2-D array used to store heightmap
//@param arraySize: dimension of terrainArray
//@param maxOffset: current offset to be used when generating height
function divide(size, terrainArray, arraySize, maxOffset){
    
    var x,y, half = size/2;
    if(half < 1)
        {
            return;
        }
    for (y = half; y < arraySize; y+=size)
        {
            for(x = half; x < arraySize; x+=size)
                {
                    square(x,y, half, Math.random()*(maxOffset/2), terrainArray, arraySize);
                }
        }
    for (y = 0; y < arraySize; y+= half)
        {
            for(x = (y+half) % size; x< arraySize; x+=size)
                {
                    diamond(x,y, half, Math.random()*(maxOffset/2), terrainArray, arraySize);
                }
        }
    divide(size/2, terrainArray, arraySize, maxOffset/2);
}
//function to generate heightmap and populate vertex array, face array, and normal array
//@param n: n-value for dimension of 2-D heightmap
//@param minX: minimum x-coordinate
//@param maxX: maximum x-coordinate
//@param minY: minimum y-coordinate
//@param maxY: maximum y-coordinate
//@param vertexArray: array to store vertices
//@param faceArray: array to store face indices
//@param normalArray: array to store normals
function diamondSquare(n, minX, maxX, minY, maxY, vertexArray, faceArray, normalArray)
{
    var size = (1<<n) + 1;
    //find dimension of 2-D array
    var dX = (maxX-minX)/size;  //calculate delta x
    var dY = (maxY-minY)/size;  //calculate delta y
    
    //create 2-D array to store heightmap
    var arr = new Array(size);
    for(var i = 0; i < size; i++)
        {
            arr[i] = new Array(size);
        }
    arr[0][0] = Math.random();
    arr[0][size-1] = Math.random();
    arr[size-1][0] = Math.random();
    arr[size-1][size-1] = Math.random();
    //initialize corners
    divide((size-1), arr, size, 5); //get heightmap
    
    //add coordinates from heightmap to vertex array
    for(var x = 0; x < size; x++){
        for(var y = 0; y < size; y++){
            vertexArray.push(minX+(dX*x));
            vertexArray.push(minY+(dY*y));
           vertexArray.push(arr[x][y]);
            
        }
    }
    //add faces
    var numT = 0;
    for(var x=0;x<size-1;x++)
       for(var y=0;y<size-1;y++)
       {
           var vid = x+(y*size);
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+size);
           
           faceArray.push(vid+1);
           faceArray.push(vid+size);
           faceArray.push(vid+size+1);
           numT+=2;
       }
    var faceN = [];
    
    //calculate face normals
    for(var i = 0;i < numT*3; i+=3)
        {
            var index1 = faceArray[i];
            var index2 = faceArray[i+1];
            var index3 = faceArray[i+2];
            var vertex1 = vec3.fromValues(vertexArray[index1*3], vertexArray[(index1*3)+1], vertexArray[(index1*3)+2]);
            var vertex2 = vec3.fromValues(vertexArray[index2*3], vertexArray[(index2*3)+1], vertexArray[(index2*3)+2]);
            var vertex3 = vec3.fromValues(vertexArray[index3*3], vertexArray[(index3*3)+1], vertexArray[(index3*3)+2]);
            var vectorA = vec3.create();
            vec3.subtract(vectorA,vertex2,vertex1);
            var vectorB = vec3.create();
            vec3.subtract(vectorB,vertex3,vertex1);
            var normal = vec3.create();
            vec3.cross(normal, vectorA, vectorB);
            vec3.normalize(normal,normal);
            faceN.push(normal);
            
            
        }
    var temp = new Array(size*size);
    for(var i = 0; i < size*size;i++)
        {
            temp[i] = vec3.create();
        }
    
    //calculate vertex normals
    for(var i = 0;i < numT; i++)
        {
            var index1 = faceArray[i*3];
            var index2 = faceArray[i*3+1];
            var index3 = faceArray[i*3+2];
            vec3.add(temp[index1], faceN[i], temp[index1]);
            vec3.add(temp[index2], faceN[i], temp[index2]);
            vec3.add(temp[index3], faceN[i], temp[index3]);
            
        }
    
    //normalize vertex normals and add to normal array
    for(var i = 0; i < size*size;i++)
        {
            vec3.normalize(temp[i],temp[i]);
            normalArray.push(temp[i][0]);
            normalArray.push(temp[i][1]);
            normalArray.push(temp[i][2]);
            
        }
    
    return numT;
}

