import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { spy } from 'sinon';

import { Documents } from '../../src/components/Documents';


const allDocumentsMock = jest.fn();
const mockStore = configureStore();
const store = mockStore({
	auth: { isAuthenticated: true, user: {} },
	users: { isAuthenticated: false, users: {}, allUsers: {}, userSearch: {}, pagination: [] },
	userDocuments: { documents: [{}], searchResults: [], document: {}, pagination: {}, errors: {} }
});
const documents = [
	{
		id: 114,
		title: 'true colors',
		content: '<p>I see your true colors</p>',
		access: 'public',
		userId: 16,
		userRoleId: 2,
		createdAt: '2017-07-21T14:53:12.916Z',
		updatedAt: '2017-07-21T14:53:12.916Z'
	}
];
const pagination = {
	totalCount: 55,
	pages: 10,
	currentPage: 1,
	pageSize: 6
};
describe('Documents Page', () => {
	it('should call ComponentDidMount()', () => {
		const componentDidMountSpy = spy(Documents.prototype, 'componentDidMount');
		mount(
			<Router >
				<Provider store={store}>
					<Documents
						pagination={pagination}
						documents={[]}
						allDocuments={allDocumentsMock}
						errors={[]}
					/>
				</Provider>
			</Router>
		);
		assert.ok(Documents.prototype.componentDidMount.calledOnce);
		componentDidMountSpy.restore();
	});
	it('should call componentWillReceiveProps()', () => {
		const componentWillReceivePropsSpy = spy(Documents.prototype, 'componentWillReceiveProps');
		const wrapper = mount(
			<Router >
				<Provider store={store}>
					<Documents
						pagination={pagination}
						documents={[]}
						allDocuments={allDocumentsMock}
						errors={[]}
					/>
				</Provider>
			</Router>
		);
		wrapper.setProps({ documents: [] });
		assert.ok(Documents.prototype.componentWillReceiveProps.calledOnce);
		componentWillReceivePropsSpy.restore();
	});
	it('should call openModal() when modal event is triggered', () => {
		const wrapper = mount(
			<Router >
				<Provider store={store}>
					<Documents
						pagination={pagination}
						documents={[]}
						allDocuments={allDocumentsMock}
						errors={[]}
					/>
				</Provider>
			</Router>
		);
		const openModalButton = wrapper.find('#btn-newModal');
		const closeModalButton = wrapper.find('#btn-createdocument');
		assert.equal(openModalButton.length, 1);
		openModalButton.simulate('click');
		assert.equal(closeModalButton.length, 1);
		closeModalButton.simulate('click');
	});
	it('Should render a ReactPaginate component', () => {
		const wrapper = mount(
			<Router >
				<Provider store={store}>
					<Documents
						pagination={pagination}
						documents={documents}
						allDocuments={allDocumentsMock}
						errors={[]}
					/>
				</Provider>
			</Router>
		);
		const nextButton = wrapper.find('#btn-Next');
		assert.equal(nextButton.length, 1);
	});
});