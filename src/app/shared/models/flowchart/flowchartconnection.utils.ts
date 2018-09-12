import { IFlowchart } from './flowchart.interface';
import { Flowchart } from './flowchart.model';

import { IGraphNode, IEdge, GraphNode, NodeUtils } from '../node/NodeModule';
import { ICodeGenerator, IModule } from '../code/CodeModule';
import { InputPort, PortTypes } from '../port/PortModule';


export class FlowchartConnectionUtils{

	// =============== Disconnect Nodes

	//
	//	Disconnects a node
	//	Deletes any edges connected to the node
	//	Resets all ports, connected to the edges, connected to the node
	//
	public static disconnect_node(flowchart: IFlowchart, idx: number): IFlowchart{
		let node = flowchart.nodes[idx];

  		node.inputs.map(function(input){
	  			input.isConnected = false;
	  			input.value = " ";
  		});

  		node.outputs.map(function(output){
    			output.isConnected = false;
    			output.value = " ";
  		});

      	let edges: number[] = FlowchartConnectionUtils.remove_edges_with_node(flowchart, idx);
        flowchart.edges = flowchart.edges.filter( (edge, index) => edges.indexOf(index) == -1 );

  		return flowchart;
  	}


	public static disconnect_edges_with_port_idx(flowchart: IFlowchart, nodeIndex: number, portIndex: number, type: string): number[]{
      let splicedEdges: number[] = [];
      let edges = flowchart.edges;
      
      for(let e=0; e < edges.length; e++){
        let edge = edges[e];

        // if type == "input"
        if( type == "input" && edge.input_address[0] == nodeIndex && edge.input_address[1] == portIndex ){
            let port = flowchart.nodes[edge.output_address[0]].outputs[edge.output_address[1]];
            port.isConnected = false;
            port.value = undefined;
            splicedEdges.push(e);
        }
        else if( type == "output" && edge.output_address[0] == nodeIndex && edge.output_address[1] == portIndex ){
            let port = flowchart.nodes[edge.input_address[0]].inputs[edge.input_address[1]];
            port.isConnected = false;
            port.value = undefined;
            splicedEdges.push(e);
        }
      }

      return splicedEdges;
  }

	//
	//	Returns array of edge indices connected to a node
	//
  public static remove_edges_with_node(flowchart: IFlowchart, node_index: number): number[]{
		let linked_edges: number[] = [];
		let edges = flowchart.edges;

		for(let e=0; e < edges.length; e++){
			let edge = edges[e];
			if( edge.output_address[0] == node_index){
			    let port = flowchart.nodes[edge.input_address[0]].inputs[edge.input_address[1]];
			    port.isConnected = false;
			    port.value = " ";
			    linked_edges.push(e);
			}
			else if(edge.input_address[0] == node_index){
			    let port = flowchart.nodes[edge.output_address[0]].outputs[edge.output_address[1]];
			    port.isConnected = false;
			    port.value = " ";
			    linked_edges.push(e);
			}
		}

		return linked_edges;
  	}

}

