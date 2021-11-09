import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/task/list',
    method: 'get',
    params: params
  })
}

export function delRow(taskId) {
  return request({
    url: '/api/task/delTask',
    method: 'DELETE',
    params:{taskId}
  })
}

export function countTask() {
  return request({
    url: '/api/task/count',
    method: 'get'
  })
}
