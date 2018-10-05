
export enum KEY_CODE {
	CUT = 88,
	COPY = 67, 
	PASTE = 86,
	LEFT = 37,
	UP = 38,
	RIGHT = 39,
	DOWN = 40,
	DELETE = 46,
	CTRL = 17, 
	SHIFT = 16
  }
  

  export class CutPaste{
	  // ---- Cut / Copy / Paste Functions
	//   @HostListener('window:keyup', ['$event'])
	// 	  keyEvent(event: KeyboardEvent) {
  
	// 		  try{
	// 			  var key = event.keyCode
	// 			  var ctrlDown = event.ctrlKey || event.metaKey // Makey support
	// 			  var shiftDown = event.shiftKey;
  
	// 			  /// key events triggered from typing - return without action
	// 			  if(!this.validateKeystroke(event)) return;
  
	// 			  /// return if there is no active procedure
	// 			  if(this.active_node.state.procedure === undefined) return;
  
	// 			  if(ctrlDown) this.handleCutCopyPaste(key);
	// 			  else if(shiftDown) this.handleMove(key);
	// 			  else if(key == KEY_CODE.DELETE)	this.handleDelete();
  
	// 			  //this//.$log.log(`Successfully executed key command: ${KEY_CODE[key]}`);
	// 		  }
	// 		  catch(ex){
	// 			  //this//.$log.log(`Error occured during key command: ${KEY_CODE[key]} \nError: ${ex}`);
	// 			  //nsole.log(ex);
	// 		  }
	// 	  }
  
	//   validateKeystroke(event){
	// 	  if((event.srcElement.className.indexOf("input") > -1)){	
	// 		  event.stopPropagation(); 
	// 		  return 0;	
	// 	  };
		  
	// 	  return 1;
	//   }
  
	//   handleCutCopyPaste(key: number){
  
	// 	  /// 
	// 	  /// key events with ctrl
	// 	  /// 
	// 	  switch (key){
	// 		  case KEY_CODE.CUT:
	// 			  this.handleCut()
	// 			  //this//.$log.log(`Cut-Copied Procedure with keys: ${this.copiedProd.type}`);
	// 			  break;
	// 		  case KEY_CODE.COPY:
	// 			  this.handleCopy();
	// 			  //this//.$log.log(`Copied Procedure with keys: ${this.copiedProd.type}`);
	// 			  break;
	// 		  case KEY_CODE.PASTE:
	// 			  try{
	// 				  this.handlePaste();
	// 				  //this//.$log.log(`Pasted Procedure with keys: ${this.copiedProd.type}`);
	// 			  }
	// 			  catch(ex){
	// 				  //this//.$log.log("Copied Procedure with keys failed because no copied procedure found.");
	// 			  }
	// 			  break;
	// 	  }
	//   }
  
	//   handleMove(key: number){
	// 	  /// 
	// 	  /// event with shift
	// 	  /// 
	// 	  let selected_procedure: IProcedure = this.active_node.state.procedure;
	// 	  let parent: IProcedure = selected_procedure.parent;
  
	// 	  if(parent == undefined){
	// 		  /// directly inside node
  
	// 	  }
	// 	  else{
	// 		  //
	// 	  }
  
	// 	  // if left, 
		  
	// 	  // 	  if no parent, nothing happens
	// 	  // 	  
	// 	  // if right, 
	// 	  //    if above procedure has children, becomes child of above in last index
	// 	  //    
		  
	// 	  let position: number;
	// 	  let procedure_above: IProcedure;
	// 	  if(parent == undefined){
	// 		  position = NodeUtils.get_child_position(this.active_node, selected_procedure);
	// 		  procedure_above = this.active_node.children[position - 1];
	// 	  }
	// 	  else{
	// 		  position = ProcedureUtils.get_child_position(parent, selected_procedure);
	// 		  procedure_above = parent.children[position - 1];
	// 	  }
  
	// 	  switch (key){
	// 		  case KEY_CODE.LEFT:
	// 			  if(!this.active_node.state.procedure.parent){ /*do nothing*/ }
	// 			  else{
	// 				  let grandparent: IProcedure = parent.parent;
	// 				  if(grandparent){
	// 					  ProcedureUtils.shift_level_up(this.active_node.state.procedure);
	// 				  }
	// 				  else{
	// 					  ProcedureUtils.delete_child(parent, selected_procedure);
	// 					  let position: number = NodeUtils.get_child_position(this.active_node, parent);
	// 					  NodeUtils.add_procedure_at_position(this.active_node, selected_procedure, position+1);
	// 				  }
	// 			  }
	// 			  break;
  
	// 		  case KEY_CODE.RIGHT:
	// 			  if(position == 0 || procedure_above === undefined || !procedure_above.hasChildren) return;
	// 			  NodeUtils.delete_procedure(this.active_node, selected_procedure);
	// 			  ProcedureUtils.add_child(procedure_above, selected_procedure);
	// 			  break;
	// 	  }
	//   }
  
	// //   handleDelete(){ NodeUtils.delete_procedure(this.active_node) };
  
	//   onAction(actionString: string){
  
	// 	  switch(actionString){
	// 		  case 'cut':
	// 			  this.handleCut();
	// 			   break;
	// 		  case 'copy':
	// 			  this.handleCopy();
	// 			  break;
	// 		  case 'paste':
	// 			  this.handlePaste();
	// 			  break;
	// 		  case 'delete':
	// 			  this.handleDelete();
	// 			  break;
	// 		  default:
	// 			  co//nsole.log("Unknown keyboard action");
	// 	  }
	//   }
  
	//   handleCut(){
	// 	  this.copiedProd = ProcedureUtils.copy_procedure(this.active_node.state.procedure);
	// 	  NodeUtils.delete_procedure(this.active_node);
	//   }
  
	//   handleCopy(){
	// 	  this.copiedProd = ProcedureUtils.copy_procedure(this.active_node.state.procedure);
	//   }
  
	//   handlePaste(){
	// 	  try{
	// 		  NodeUtils.add_procedure(this.active_node, this.copiedProd);
	// 		  this.copiedProd = ProcedureUtils.copy_procedure(this.copiedProd);
	// 	  }
	// 	  catch(ex){
	// 		  //console.log("Error Pasting");
	// 	  }
	//   }

  }