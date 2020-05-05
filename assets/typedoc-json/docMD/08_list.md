# LIST    

## Add  
* **Description:** Adds an item to a list.  
* **Parameters:**  
  * *list:* List to add the item to.  
  * *item:* Item to add.  
  * *method:* Enum, select the method.  
* **Returns:** void  
* **Examples:**  
  * append = list.Add([1,2,3], 4, 'at_end')  
    Expected value of list is [1,2,3,4].  
  * append = list.Add([1,2,3], [4, 5], 'at_end')  
    Expected value of list is [1,2,3,[4,5]].  
  * append = list.Add([1,2,3], [4,5], 'extend_end')  
    Expected value of list is [1,2,3,4,5].  
  * append = list.Add(["a", "c", "d"], "b", 'alpha_descending')  
    Expected value of list is ["a", "b", "c", "d"].
  
  
## Remove  
* **Description:** Removes items in a list.
~
If @param method is set to 'index', then @param item should be the index of the item to be replaced.
Negative indexes are allowed.
If @param method is not set to 'index', then @param item should be the value.  
* **Parameters:**  
  * *list:* The list in which to remove items  
  * *item:* The item to remove, either the index of the item or the value. Negative indexes are allowed.  
  * *method:* Enum, select the method for removing items from the list.  
* **Returns:** void  
  
## Replace  
* **Description:** Replaces items in a list.
~
If @param method is set to 'index', then @param old_item should be the index of the item to be replaced. Negative indexes are allowed.
If @param method is not set to 'index', then @param old_item should be the value.  
* **Parameters:**  
  * *list:* The list in which to replace items  
  * *old_item:* The old item to replace.  
  * *new_item:* The new item.  
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
  * *items_to_insert:* Optional, list of items to add, or null.  
* **Returns:** void  
* **Examples:**  
  * result = list.Splice(list1, 1, 3, [2.2, 3.3])  
    where list1 = [10, 20, 30, 40, 50]
Expected value of result is [10, 2.2, 3.3, 50]. New items were added where the items were removed.
  
  
