import React from 'react';
import './App.css';

class List extends React.Component{
	
	render (){
		return (
			<div className="listItem" draggable="true" listindex={this.props.index} onDragStart={(event) => {this.props.drag(event, this);  event.stopPropagation();}}>
				<div className="listHeader">{this.props.listData.listName}<button onClick={() => {this.props.deleteList(this.props.index)}} className="deleteList">Delete list</button></div>
				<div className="cardsArea" onDrop={(event) => {this.props.drop(event, this); event.preventDefault(); event.stopPropagation();}} onDragEnter={(e) => {e.stopPropagation(); e.preventDefault();}} onDragOver={(e) => {e.stopPropagation(); e.preventDefault();}}>{
					this.props.listData.cards.map((val, ind) => {
						return <Card key={'card'+ind} listIndex={this.props.index} index={ind} drag={this.props.drag} cardClick={this.props.cardClick} cardData={val}></Card>
					})
				}</div>
				<button onClick={() => {this.props.addCard(this.props.index)}} className="addC">Add card...</button>
			</div>
		)
	}
}

class Card extends React.Component{
	render (){
		return (
			<div className="card" draggable="true" listindex={this.props.listIndex} cardindex={this.props.index} onClick={() => {this.props.cardClick(this.props.listIndex, this.props.index)}} onDragStart={(event) => {this.props.drag(event, this); event.stopPropagation();}}>{this.props.cardData.cardTitle} <br/> <br/> {this.props.cardData.description}</div>
		)
	}
}

class Modal extends React.Component{
	render () {
		return (
			<div className='modal show-modal'>
				<div className="modal-content">
					<span className="close-button" onClick={() => {this.props.saveChanges(this.props.listIndex, this.props.cardIndex)}}>&times;</span><button className="float-right" onClick={() => {this.props.deleteCard(this.props.listIndex, this.props.cardIndex)}}>Delete card</button>
					<div className="modal-form">
						
							<input type="text" name="cardTitle" defaultValue={this.props.cardData.cardTitle} />
							<textarea name="description" placeholder="Card description" defaultValue={this.props.cardData.description}></textarea>
							<textarea id="comments" name="comments" defaultValue=""></textarea>
							<button onClick = {() => {this.props.addComment(document.querySelector('#comments').value, this.props.listIndex, this.props.cardIndex)}}>Add Comment</button>
						
						
					</div>
					<div className="clear"></div>
					<div className="add-comment">{
						this.props.cardData.comments.map((val, ind) => {
							return <div key={'comment'+ind}><p>{val.comment}</p><p>{val.date}</p></div>
						})
					}
					</div>
				</div>
			</div>
		);
	}
}

class App extends React.Component{
	state = {
		"lists" : [
		  {
			"listName" : "First List",
			"cards" : [
			  {
				"cardTitle" : "Card One",
				"description" : "This is a sample card",
				"comments" : [
				  {
					"comment" : "Sample comment",
					"date" : "Today"
				  }
				]
			  }
			]
		  }
		],
		"modalShow" : false,
		"clickedCardIndex" : '',
		"clickedListIndex" : '',
		"elements" : []
 	}
	//Add New List
	addList = () => {
		let tempState = Object.assign([], this.state.lists);
		const newList = {
			"listName" : "New List",
			"cards" : [
			  {
				"cardTitle" : "Card One",
				"description" : "This is a sample card",
				"comments" : [
				  {
					"comment" : "Sample comment",
					"date" : "Today"
				  }
				]
			  }
			]
		  }
		tempState.push(newList);
		this.setState({lists : tempState});
	}
	//Delete List
	deleteList = (index) => {
		let tempState = Object.assign([], this.state.lists);
		tempState.splice(index, 1);
		console.log('triggered' + index)
		this.setState({lists : tempState});
	}
	//Add Cards inside List
	addCard = (index) => {
		let tempState = Object.assign([], this.state.lists);
		let newCard = {
			"cardTitle" : "New Card",
			"description" : "This is a sample card",
			"comments" : [
			  {
				"comment" : "Sample comment",
				"date" : "Today"
			  }
			]
		  }
		tempState[index].cards.push(newCard);
		this.setState({lists : tempState});
	}
	//Save Changes on card close
	saveChanges = (listIndex, cardIndex) => {
		let tempState = Object.assign([], this.state.lists);
		tempState[listIndex].cards[cardIndex].cardTitle = document.querySelector('input[name="cardTitle"]').value;
		tempState[listIndex].cards[cardIndex].description = document.querySelector('textarea[name="description"]').value;
		this.setState({lists : tempState, "modalShow" : false, "clickedCardIndex" : '', "clickedListIndex" : ''});
	}
	//View Card
	cardClick = (listIndex, cardIndex) => {
		let tempState = Object.assign([], this.state);
		tempState.modalShow = true;
		tempState.clickedCardIndex = cardIndex;
		tempState.clickedListIndex = listIndex;
		this.setState(tempState);
	}
	//Add Comment inside each card
	addComment = (val, listIndex, cardIndex) => {
		if(val){
			let tempState = Object.assign([], this.state.lists);
			tempState[listIndex].cards[cardIndex].comments.push({"comment" : val, "date" : "Today"});
			this.setState({lists : tempState});
		}
		else{
			alert("Please enter comment");
		}
	}
	// Deletes card
	deleteCard = (listIndex, cardIndex) => {
		let tempState = Object.assign([], this.state.lists);
		tempState[listIndex].cards.splice(cardIndex, 1);
		this.setState({lists : tempState, "modalShow" : false, "clickedCardIndex" : '', "clickedListIndex" : ''});
	}
	//Card/List Drag
	drag = (ev, element) => {
		var elements = this.state.elements;
	  var index = elements.indexOf(element);
		if (index === -1) {
			elements.push(element);
			index = elements.length - 1;
		}
		ev.dataTransfer.setData('index', index);
		this.setState({"elements" : elements});
	}
	//Drop Card
	drop = (ev, target) => {
		ev.preventDefault();
		var element = this.state.elements[ev.dataTransfer.getData('index')];
		if(!element.props.listData){
			let targetListIndex = ev.target.getAttribute("listindex");
			let elListIndex = element.props.listIndex;
			let targetCardIndex = ev.target.getAttribute("cardindex");
			let elCardIndex = element.props.index;
			console.log(targetListIndex, elListIndex, targetCardIndex, elCardIndex);
			console.log(element);
			let tempState = Object.assign([], this.state.lists);
			tempState[targetListIndex].cards.splice(targetCardIndex+1, 0, tempState[elListIndex].cards[elCardIndex]);
			tempState[elListIndex].cards.splice(elCardIndex, 1);
			this.setState({lists : tempState});
		}
	}
	//Drop List
	dropList = (ev, target) => {
		ev.preventDefault();
		var element = this.state.elements[ev.dataTransfer.getData('index')];
		let targetListIndex = ev.target.getAttribute("listindex");
		let elListIndex = element.props.index;
		console.log(targetListIndex, elListIndex)
		let tempState = Object.assign([], this.state.lists);
		let dragged = tempState[elListIndex];
		tempState.splice(elListIndex, 1);
		tempState.splice(targetListIndex, 0, dragged);
		this.setState({lists : tempState});
	}
	
	render (){
		return (
			<div className="App">
				<div id="show-list" onDrop={(event) => {this.dropList(event, this); event.preventDefault(); event.stopPropagation();} } onDragEnter={(e) => {e.stopPropagation();e.preventDefault();}} onDragOver={(e) => {e.stopPropagation();e.preventDefault();}}><button id="addlist" onClick={this.addList.bind(this)}>Add list</button>
					{
						this.state.lists.map((val, ind) =>{
							return <List key={'list'+ind} listData={val} drag={this.drag} drop={this.drop} index={ind} deleteList = {this.deleteList} addCard = {this.addCard} cardClick={this.cardClick}></List>
						})
					}
					{
						this.state.modalShow ? <Modal modalShow = {this.state.modalShow} cardIndex = {this.state.clickedCardIndex} listIndex = {this.state.clickedListIndex} cardData={this.state.lists[this.state.clickedListIndex].cards[this.state.clickedCardIndex]} deleteCard={this.deleteCard} addComment={this.addComment} saveChanges={this.saveChanges}></Modal> : ''
					}
				</div>
			</div>
		)
	}
}

export default App;
