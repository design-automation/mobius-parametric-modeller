# LIST    

## Add  
* **Description:** Adds an item to a list.
If item is a list, the entire list will be added as a single item.  
* **Parameters:**  
  * *list:* List to add the item to.  
  * *value:* Item to add.  
  * *method:* Enum, select the method.  
* **Returns:** void  
* **Examples:**  
  * append = list.Add(list, 4, 'at_end')  
    where list = [1,2,3]
Expected value of list is [1,2,3,4].
  
  
## Remove  
* **Description:** Removes items in a list.  
* **Parameters:**  
  * *list:* The list in which to remove items  
  * *item:* The item to remove, either the index of the item or the value. Negative indexes are allowed.  
  * *method:* Enum, select the method for removing items from the list.  
* **Returns:** void  
  
## Replace  
* **Description:** Replaces items in a list.  
* **Parameters:**  
  * *list:* The list in which to replace items  
  * *item:* The item to replace, either the index of the item or the value. Negative indexes are allowed.  
  * *new_value:* The new value.  
  * *method:* Enum, select the method for replacing items in the list.  
* **Returns:** void  
  
## Sort  
* **Description:** Sorts an list, based on the values of the items in the list.
~
For alphabetical sort, values are sorted character by character,
numbers before upper case alphabets, upper case alphabets before lower case alphabets.  
* **Parameters:**  
  * *list:* List to sort.  
  * *method:* Enum; specifies the sort method to use.  
* **Returns:** void  
* **Examples:**  
  * list.Sort(list, 'alpha')  
    where list = ["1","2","10","Orange","apple"]
Expected value of list is ["1","10","2","Orange","apple"].  
  * list.Sort(list, 'numeric')  
    where list = [56,6,48]
Expected value of list is [6,48,56].
  
  
## Splice  
* **Description:** Removes and inserts items in a list.
~
If no items_to_add are specified, then items are only removed.
If num_to_remove is 0, then values are only inserted.  
* **Parameters:**  
  * *list:* List to splice.  
  * *index:* Zero-based index after which to starting removing or inserting items.  
  * *num_to_remove:* Number of items to remove.  
  * *items_to_insert:* List of items to add, or null.  
* **Returns:** void  
* **Examples:**  
  * result = list.Splice(list1, 1, 3, [2.2, 3.3])  
    where list1 = [10, 20, 30, 40, 50]
Expected value of result is [10, 2.2, 3.3, 50]. New items were added where the items were removed.
  
  
## Append  
* **Description:** Adds an item to a list.
If item is a list, the entire list will be appended as a single item.  
* **Parameters:**  
  * *list:* List to append the item to.  
  * *value:* Item to append.  
  * *method:* Enum, select the method.  
* **Returns:** void  
* **Examples:**  
  * append = list.Append(list, 4, 'at_end')  
    where list = [1,2,3]
Expected value of list is [1,2,3,4].
  
  
## RemoveIndex  
* **Description:** Removes the value at the specified index from a list.
~
WARNING: This function has been deprecated. Please use the list.Modify() function.  
* **Parameters:**  
  * *list:* List to remove value from.  
  * *index:* Zero-based index number of value to remove.  
* **Examples:**  
  * remove = list.RemoveIndex(list,1)  
    where list = [1,2,3]
Expected value of remove is [1,3].
  
  
## RemoveValue  
* **Description:** Removes values that matches specified value from a list.
Items must match both the value and type of specified value.
~
Returns original list if no values in list match specified value.
~
WARNING: This function has been deprecated. Please use the list.Modify() function.  
* **Parameters:**  
  * *list:* List to remove value from.  
  * *value:* Value to search for.  
  * *method:* Enum; specifies whether to remove all occurances or only the first.  
* **Examples:**  
  * remove = list.RemoveValue(list,2,'remove_all')  
    where list = [1,2,2,3]
Expected value of remove is [1,3].
  
  
## ReplaceValue  
* **Description:** Replaces values that matches specified value from an list with a new value
Items must match both the value and type of specified value
~
Returns original list if no value in list matches specified value.
~
WARNING: This function has been deprecated. Please use the list.Modify() function.  
* **Parameters:**  
  * *list:* List to remove value from.  
  * *value1:* Value to search for.  
  * *value2:* Value to replace existing value with.  
  * *method:* Enum; specifies whether to replace all occurances or only the first.  
* **Examples:**  
  * replace = list.ReplaceValue(list,2,9,'replace_all')  
    where list = [1,2,2,3]
Expected value of replace is [1,9,9,3].
  
  
## IndexOf  
* **Description:** Searches for a value in a list and returns the index position if found.
Items must match both the value and type of specified value.
~
Returns -1 if no values in list match specified value.
~
WARNING: This function has been deprecated. Please use the inline listFind() function.  
* **Parameters:**  
  * *list:* List.  
  * *value:* Value to search for.  
  * *method:* Enum, specifies whether to search all occurances or only the first.  
* **Returns:** Index position or list of index positions containing specified value.  
* **Examples:**  
  * positions = list.IndexOf(list,2,true)  
    where list = [6,2,2,7]
Expected value of positions is [1,2].
  
  
## Includes  
* **Description:** Searches for a value in an list and returns true if found.
Items must match both the value and type of specified value.
~
Returns false if no values in list match specified value.
~
WARNING: This function has been deprecated. Please use the inline listHas() function.  
* **Parameters:**  
  * *list:* List.  
  * *value:* Value to search for.  
* **Returns:** Returns true if value can be found in list, false if value cannot be found.  
* **Examples:**  
  * exists = list.Includes(list,2)  
    where list = [6,2,2,7]
Expected value of exists is true.
  
  
## Copy  
* **Description:** Creates a new list by creating a new list by making a copy of an existing list.
~
WARNING: This function has been deprecated. Please use the inline listCopy() function.  
* **Parameters:**  
  * *list:* List to copy.  
* **Returns:** New duplicated list.  
* **Examples:**  
  * copy1 = list.Copy(list)  
    where list = [1,2,3]
Expected value of copy is [1,2,3].
  
  
## Concat  
* **Description:** Creates a new list by combining two lists into a new list.
~
WARNING: This function has been deprecated. Please use the inline listJoin() function.  
* **Parameters:**  
  * *list1:* First list.  
  * *list2:* Second list.  
* **Returns:** Combined list (list1 first, followed by list2).  
* **Examples:**  
  * newlist = list.Concat(list1,list2)  
    where list1 = [1,2,3]
and list2 = [9,0]
Expected value of newlist is [1,2,3,9,0].
  
  
## Flatten  
* **Description:** Creates a new list by flattening an n-dimensional list into a one-dimensional list.
~
WARNING: This function has been deprecated. Please use the inline listFlat() function.  
* **Parameters:**  
  * *list:* List to flatten.  
* **Returns:** Flattened list.  
* **Examples:**  
  * flatten = list.Flatten(list)  
    where list = [1,2,3,[4,5]]
Expected value of flatten is [1,2,3,4,5].
  
  
## Slice  
* **Description:** Creates a new list by copying a portion of an existing list, from start index to end index (end not included).
~
WARNING: This function has been deprecated. Please use the inline listSlice() function.  
* **Parameters:**  
  * *list:* List to slice.  
  * *start:* Zero-based index at which to begin slicing.
     A negative index can be used, indicating an offset from the end of the sequence.
     If start is undefined, slice begins from index 0.  
  * *end:* Zero-based index before which to end slicing. Slice extracts up to but not including end.
     A negative index can be used, indicating an offset from the end of the sequence.
     If end is undefined, slice extracts through the end of the sequence.  
* **Returns:** A new list.  
* **Examples:**  
  * result = list.Slice(list,1,3)  
    where list = [1,2,3,4,5]
Expected value of result is [2,3].
  
  
## Reverse  
* **Description:** Reverses the order of values in a list and returns a new list.
~
WARNING: This function has been deprecated. Please use the list.Sort() function.  
* **Parameters:**  
  * *list:* List to reverse.  
* **Returns:** New reversed list.  
* **Examples:**  
  * result = list.Reverse(list1)  
    where list1 = [1,2,3]
Expected value of result is [3,2,1].
  
  
