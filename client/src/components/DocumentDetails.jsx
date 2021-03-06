import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import Parser from 'html-react-parser';
import jwt from 'jwt-decode';
import tinyMceConfig from '../utils/tinyMceConfig.json';
import { documentDetails } from '../actions/documentDetails';
import { editDocument } from '../actions/editDocument';
import validateInput from '../../../server/helpers/editDocumentValidation';
/**
 * @class Documents
 * @extends {React.Component}
 */
class DocumentDetails extends React.Component {
	/**
	 * @param  {object} props
	 * @return {void}
	 */
	constructor(props) {
		super(props);
		this.decoded = jwt(localStorage.getItem('token'));
		this.state = {
			id: this.props.match.params.id,
			title: '',
			access: '',
			content: '',
			edit: false,
			errors: {}
		};
		this.openEditor = this.openEditor.bind(this);
		this.closeEditor = this.closeEditor.bind(this);
		this.updateDocument = this.updateDocument.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	/**
	 * @description Lifcycle Method
	 * @return {void}
	 */
	componentWillMount() {
		this.props.documentDetails(this.state.id).then(() => {
			this.setState({
				title: this.props.document.title,
				content: this.props.document.content,
				access: this.props.document.access
			});
		});
	}
	/**
	 * @param  {object} e
	 * @return {void}
	 */
	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	/**
	 * @description Checks for form validity
	 * @return {Boolean}
	 */
	isValid() {
		const { errors, isValid } = validateInput(this.state);
		if (!isValid) {
			this.setState({ errors });
		}
		return isValid;
	}
	/**
	 * @description Activates TinyMCE Editor
	 * @return {void}
	 */
	openEditor() {
		tinymce.init(tinyMceConfig);
		this.setState({ edit: true });
	}
	/**
	 * @description De-Activates TinyMCE Editor
	 * @return {void}
	 */
	closeEditor() {
		tinymce.remove('#e-content');
		this.setState({
			edit: false,
			title: this.props.document.title,
			content: this.props.document.content,
			access: this.props.document.access
		});
	}
	/**
	 * @description Triggers action to update document
	 * @return {void}
	 */
	updateDocument() {
		if (this.isValid()) {
			this.setState({ errors: {} });
			const content = tinymce.activeEditor.getContent();
			const parsedContent = Parser(content);
			const newDocument = {
				id: this.state.id,
				title: this.state.title,
				content: parsedContent.props.children,
				access: this.state.access
			};
			this.props.editDocument(newDocument).then(() => {
				tinymce.remove('#e-content');
				this.setState({ edit: false });
				Materialize.toast('Document Updated Successfully', 4000);
				this.setState({
					title: this.props.documents.title,
					content: this.props.documents.content,
					access: this.props.documents.access
				});
			},
			(err) => {
				this.setState({ errors: err.response.data });
			}
			);
		}
	}
	/**
	 * @description Render content to the screen
	 * @return {void}
	 */
	render() {
		let errors = {};
		if (this.state.errors !== null) {
			errors = this.state.errors;
		}
		const userId = this.decoded.id;
		const documentId = this.props.document.userId;
		const accessName = ['Public', 'Private', 'Role'];
		const accessOptions = accessName.map(value => (
			<option key={value} value={value}> {value} </option>
		));
		return (
			<div className="doc-wrapper">
				<div className="document-panel">
					<div className="f-center">
						<h5 className="document-panel-header"><span>Document Details</span></h5><br /><br />
						{this.state.edit ? (
							<div>
								<span className="edit-doc-error">{errors.title}</span><br />
								<span className="edit-doc-error">{errors.content}</span><br />
							</div>
						) : ''}
						<div>
							{ userId === documentId ?
								(
									<div className="create-doc">
										<a href="#!" className="create-doc-link" onClick={this.openEditor}>Edit</a>
									</div>) : ''}
						</div>
						<div>
							{
								this.state.edit ? (
									<div>
										<input
											type="text"
											name="title"
											value={this.state.title}
											onChange={this.onChange}
										/>
										<select
											name="access"
											id="access"
											className="browser-default"
											value={this.state.access}
											onChange={this.onChange}
										>
											{ accessOptions }
										</select>
									</div>
								) : (
									<div>
										<p className="editor-title">{this.state.title}</p>
										<div>
											Access: {this.state.access}
										</div>
									</div>
								)
							}
						</div>
						<div className="editor-container">
							<div className="editor-content" id="e-content">
								{ Parser(this.state.content) }
							</div>
						</div>
					</div>
					{ (this.state.edit === true) ?
						(<div className="editor-buttons">
							<button
								onClick={this.updateDocument}
								className="button-primary button-block"
							>Save</button>
							<button
								onClick={this.closeEditor}
								className="button-primary button-block"
							>
								Cancel
							</button>
						</div>
						) : ''}
				</div>
			</div>
		);
	}
}
DocumentDetails.propTypes = {
	document: propTypes.shape({
		title: propTypes.string.isRequired,
		content: propTypes.string.isRequired,
		access: propTypes.string.isRequired,
		userId: propTypes.number.isRequired
	}).isRequired,
	documents: propTypes.shape({
		title: propTypes.string.isRequired,
		content: propTypes.string.isRequired,
		access: propTypes.string.isRequired,
		userId: propTypes.number.isRequired
	}).isRequired,
	documentDetails: propTypes.func.isRequired,
	editDocument: propTypes.func.isRequired,
	match: propTypes.shape({
		params: propTypes.shape({
			id: propTypes.string
		})
	}).isRequired
};
/**
 * @description Maps State to Props
 * @param  {object} state
 * @return {void}
 */
function mapStateToProps(state) {
	return {
		document: state.userDocuments.document,
		documents: state.userDocuments.documents,
	};
}
export default withRouter(connect(mapStateToProps,
	{ documentDetails, editDocument })(DocumentDetails));

