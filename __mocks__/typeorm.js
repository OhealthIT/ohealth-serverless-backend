const repositoryMock = jest.mock();
const qbuilderMock = jest.mock();

jest.mock("typeorm", () => {
  qbuilderMock.where.mockReturnThis();
  qbuilderMock.select.mockReturnThis();
  repositoryMock.createQueryBuilder.mockReturnValue(qbuilderMock);

  return {
    getRepository: () => repositoryMock,

    BaseEntity: class Mock {},
    ObjectType: () => {},
    Entity: () => {},
    InputType: () => {},
    Index: () => {},
    PrimaryGeneratedColumn: () => {},
    Column: () => {},
    CreateDateColumn: () => {},
    UpdateDateColumn: () => {},
    OneToMany: () => {},
    ManyToOne: () => {},
  };
});
