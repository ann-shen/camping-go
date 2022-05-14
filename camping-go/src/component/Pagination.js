import styled from "styled-components";
import { Font, Display, Img, Button } from "../css/style";

const PageWrap = styled.div`
  width:92%;
  display: flex;
  justify-content: center;
  margin-top:-580px;
`;

const PageLink = styled.a`
  text-decoration: none;
  font-size: 16px;
  
`;

const ListLink = styled.li`
  &:hover {
    color: #fffef4;
    background-color: #dcd8b3;
    box-shadow: none;
  }
  list-style: none;
  width: 16px;
  padding: 3px 8px;
  color: #426765;
  margin-left: 5px;
  border-right: #426765 1px solid;
  cursor: pointer;
`;

const PaginationBar = ({ pagination, totalPosts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / pagination.posts_per_page); i++) {
    pageNumbers.push(i);
  }

  return (
    <Display width='100%' >
      <PageWrap>
        {pageNumbers.map((number) => (
          <ListLink
            key={number}
            className='page-item'
            onClick={() => paginate(number)}>
            <PageLink className='page-link'>{number}</PageLink>
          </ListLink>
        ))}
      </PageWrap>
    </Display>
  );
};

export default PaginationBar;
