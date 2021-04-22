# CONTROL FLOW  
  
## If  
  
**Description:** Inserts a conditional 'If' statement into the procedure.  
  
## Elseif  
  
**Examples:**  
  * If a > 4  
    b = 0  
    Else-if a > 3  
    b = 1.  
  
**Description:** Inserts a conditional 'Else-if' statement, which must be part of a compound conditional 'If' statement. The 'Else-if' statement must directly follow either an 'If' statement or another 'Else-if' statement.  
  
## Else  
  
**Description:** Inserts a conditional 'Else' statement, which must be part of a compound conditional 'If' statement. The 'Else' statement must directly follow either an 'If' statement or another 'Else-if' statement.  
  
## Foreach  
  
**Description:** Inserts a 'For-each' loop statement. The body of the loop can be executed zero or more times.  
  
## While  
  
**Description:** Inserts a 'While' loop statement. The body of the loop can be executed zero or more times.  
  
## Break  
  
**Description:** Inserts a 'Break' statement into the body of either a 'For-each' loop or a 'While' loop. When the 'Break' is executed, execution will break out of the loop and procedure to the next line of code immediatley after the loop statement. The 'Break' statement os typically nested inside a conditional 'If' statement.  
  
## Continue  
  
**Description:** Inserts a 'Continue' statement into the body of either a 'For-each' loop or a 'While' loop. When the 'Continue' is executed, execution will skips the subsequent lines of code in the loop body and continue with the next iteration of the loop. The 'Continue' statement is typically nested inside a conditional 'If' statement.  
  
## Return  
  
**Description:** Inserts a 'Return' statement into either the body of a procedure or the body of a local function.  
  
## Error  
  
**Description:** Inserts an 'Error' statement. When executed, the 'Error' statement will raise an error and print an error message to the console. The 'Error' statement is typically nested inside a conditional 'If' statement.  
  
