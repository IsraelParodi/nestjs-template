import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
} from '../tests.helper';

const roleDto = {
  name: 'Israel',
  description: 'Parodi',
};

const roleWithPermissionDto = {
  name: 'Parodi',
  description: 'Schmidt',
  permissions: [1],
};

let roleId;

function expectedRoleShape(payload: any) {
  expect(payload).toMatchObject({
    id: expect.any(Number),
    name: expect.any(String),
    description: expect.any(String),
  });
}

describe('[Feature] - Roles - /roles', () => {
  describe('Roles [POST /roles]', () => {
    it('should create a role', async () => {
      const response = await postRequest('/roles', roleDto, 201, true);
      roleId = response.body.payload.id;
      expectedRoleShape(response.body.payload);
    });

    it('should create a role with roles', async () => {
      const response = await postRequest(
        '/roles',
        roleWithPermissionDto,
        201,
        true,
      );
      roleId = response.body.payload.id;
      expectedRoleShape(response.body.payload);
    });

    it('should validate that the role already exists', async () => {
      const response = await postRequest('/roles', roleDto, 400, true);
      expect(response.body.error).toEqual({
        message: `The Role already exists`,
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });

  describe('Roles [PATCH /roles/:id]', () => {
    const updateRoleDto = {
      ...roleDto,
      name: 'Pedro',
    };

    it('should update a role', async () => {
      const response = await patchRequest(
        `/roles/${roleId}`,
        updateRoleDto,
        200,
        globalThis.accessToken,
      );
      expectedRoleShape({ ...response.body.payload, id: roleId });
    });
  });

  describe('Roles [GET /roles]', () => {
    it('should return a list of roles', async () => {
      const response = await getRequest('/roles', 200, globalThis.accessToken);
      expect(response.body.payload.data.length).toBeGreaterThanOrEqual(2);
      expect(response.body.payload.total).toBeGreaterThanOrEqual(2);
      expect(response.body.payload.totalPages).toBe(1);
      expectedRoleShape(response.body.payload.data[0]);
    });
  });

  describe('Role by id [GET /roles/:id]', () => {
    it('should return a role by id', async () => {
      const response = await getRequest(
        `/roles/${roleId}`,
        200,
        globalThis.accessToken,
      );
      expectedRoleShape(response.body.payload);
    });

    it('should fail when role not found', async () => {
      const rolesId = 9999;
      const response = await getRequest(
        `/roles/${rolesId}`,
        404,
        globalThis.accessToken,
      );

      expect(response.body.error).toEqual({
        message: `Role with id=${rolesId} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('Delete role by id [DELETE /roles/:id]', () => {
    it('should delete a role by id', async () => {
      const response = await deleteRequest(
        `/roles/${roleId}`,
        200,
        globalThis.accessToken,
      );
      expect(response.body.payload).toEqual({
        raw: expect.any(Array),
        affected: 1,
      });
    });
  });
});
