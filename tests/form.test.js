import 'babel-polyfill'
import {mount} from 'vue-test-utils'
import Form from '../src/Form'
import moxios from 'moxios'

window.scroll = jest.fn

let model = {
    test: 'payload'
}

describe('Form', () => {
    let wrapper
    let vm

    beforeEach(() => {
        wrapper = mount(Form, {
            propsData: {
                action: 'test/action',
                method: 'PUT',
                model
            }
        })

        vm = wrapper.vm
        moxios.install()
    })

    afterEach(() => {
        moxios.uninstall()
    })

    test('has a method', () => {
        expect(wrapper.props().method).toBe('PUT')
    })

    test('it has the form on load', () => {
        expect(wrapper.contains('b-form')).toBe(true)
    })

    test('it submits', (done) => {
        expect(vm.submitted).toBe(false)

        moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
                status: 200
            }).then(function () {
                expect(vm.submitted).toBe(true)
                expect(vm.submitting).toBe(false)
                expect(vm.errors).toEqual({})
                done()
            })
        })

        wrapper.find('b-form').trigger('submit')
    })

    test('it handles validation errors', (done) => {

        const message = 'An error'
        const errors = {
            error: 'error',
            another: 'another'
        }

        expect(vm.submitted).toBe(false)

        moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
                status: 422,
                response: {message, errors}
            }).then(function () {
                expect(vm.submitted).toBe(false)
                expect(vm.submitting).toBe(false)
                expect(vm.errors).toEqual(errors)
                expect(vm.message).toEqual(message)
                done()
            })
        })

        wrapper.find('b-form').trigger('submit')
    })

    test('it handles failure', (done) => {

        expect(vm.submitted).toBe(false)

        moxios.wait(function () {
            let request = moxios.requests.mostRecent()
            request.respondWith({
                status: 404
            }).then(function () {
                expect(vm.submitted).toBe(false)
                expect(vm.submitting).toBe(false)
                expect(vm.errors).toEqual({})
                expect(vm.message).toEqual('Submission Failed')
                done()
            })
        })

        wrapper.find('b-form').trigger('submit')
    })

    test('it can custom validate', () => {

        const message = 'fail'

        wrapper = mount(Form, {
            propsData: {
                action: 'test/action',
                method: 'PUT',
                validate: () => message,
                model
            }
        })

        vm = wrapper.vm

        expect(vm.submitted).toBe(false)

        wrapper.find('b-form').trigger('submit')

        expect(vm.submitted).toBe(false)
        expect(vm.message).toEqual(message)
    })
})