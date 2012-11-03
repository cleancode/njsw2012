#!/bin/bash

CHAR='#'
CHARS_PER_LINE=1000
LINE=`head -c $CHARS_PER_LINE < /dev/zero | tr '\0' $CHAR`
LINE_COUNTER=0
NUMBER_OF_LINES=100

while [ $LINE_COUNTER -lt $NUMBER_OF_LINES ]; do
    stdbuf -o42 echo $LINE
    (( LINE_COUNTER++ ))
done
